import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// import {Fabric} from 'fabric-for-editor';
import {Fabric} from 'projects/fabric2go/src/public_api';
import * as LoadImage from 'blueimp-load-image/js';
import * as WebFont from 'webfontloader';
import {SAVE_PROPERTIES} from '../shared/data/config';
import {StateService} from './state.service';

const SRC_ZOOM_VALUES: number[] = [0.01, 0.025, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

export interface BoundingBox {
  top: number;
  left: number;
  height: number;
  width: number;
}

enum OBJECTS {
  BACKGROUND = 'background',
  FOREGROUND = 'foreground',
  TEXT = 'text'
}

@Injectable({
  providedIn: 'root'
})
export class FabricService {
  canvas: Fabric.Canvas;

  constructor(private state: StateService, private translate: TranslateService) {
  }

  static getMinScaleLimit(object) {
    switch (object.subtype) {
      case 'background':
        return 1;
      case 'foreground':
        return .25;
      case 'text':
        return .5;
      default:
        return object.minScaleLimit;
    }
  }

  static getPixelsToPercent(pixelsInXPercents: number, pixelsIn100Percents: number): number {
    return pixelsInXPercents / pixelsIn100Percents * 100;
  }

  static checkSourceBorders(object): void {
    const elementToDraw = object._element,
      scaleX = object.scaleX,
      scaleY = object.scaleY,
      maxScale = Math.max(scaleX, scaleY),
      multiX = scaleX / maxScale,
      multiY = scaleY / maxScale,
      width = object.sourceZoom * elementToDraw.width * multiX,
      height = object.sourceZoom * elementToDraw.height * multiY;

    if ((object.sourceCenter.y - height / 2) < 0) {
      object.sourceCenter.y = height / 2;
    }
    if ((object.sourceCenter.y + height / 2) > elementToDraw.height) {
      object.sourceCenter.y = elementToDraw.height - height / 2;
    }
    if ((object.sourceCenter.x - width / 2) < 0) {
      object.sourceCenter.x = width / 2;
    }
    if ((object.sourceCenter.x + width / 2) > elementToDraw.width) {
      object.sourceCenter.x = elementToDraw.width - width / 2;
    }
  }

  static getZoomCompensatedBoundingRect(object, canvas) { /* Native Fabric.js boundingRectangle ignores Zoom */
    const boundingRect = object.getBoundingRect();
    const zoom = canvas.getZoom();
    const viewportMatrix = canvas.viewportTransform;
    boundingRect.top = (boundingRect.top - viewportMatrix[5]) / zoom;
    boundingRect.left = (boundingRect.left - viewportMatrix[4]) / zoom;
    boundingRect.width /= zoom;
    boundingRect.height /= zoom;
    return boundingRect;
  }

  static isInside(a: BoundingBox, b: BoundingBox): boolean {
    return a.left <= b.left || a.top <= b.top || a.left + a.width >= b.left + b.width || a.top + a.height >= b.top + b.height;
  }

  static preserveAspectRatio(object, corner): void {
    if (corner === 'mt' || corner === 'mb') { /* Vertical handlers */
      object.scale(object.scaleY);
    }
    if (corner === 'ml' || corner === 'mr') { /* Horizontal handlers */
      object.scale(object.scaleX);
    }
  }

  static restrictMovementInside(canvas, object, surface): void {
    const boundingRectangle = FabricService.getZoomCompensatedBoundingRect(object, canvas);
    /* left, top, width, height */
    if (boundingRectangle.left <= surface.left) { /* Left border */
      object.set({left: surface.left + boundingRectangle.width / 2});
    }
    if (boundingRectangle.top <= surface.top) { /* Top border */
      object.set({top: surface.top + boundingRectangle.height / 2});
    }
    if (boundingRectangle.left + boundingRectangle.width >= surface.left + surface.width) { /* Right border */
      object.set({left: surface.left + surface.width - boundingRectangle.width / 2});
    }
    if (boundingRectangle.top + boundingRectangle.height >= surface.top + surface.height) { /* Bottom border */
      object.set({top: surface.top + surface.height - boundingRectangle.height / 2});
    }
  }

  static restrictMovementOutside(canvas, object, surface): void {
    const boundingRectangle = FabricService.getZoomCompensatedBoundingRect(object, canvas);
    /* left, top, width, height */
    if (boundingRectangle.left >= surface.left) { /* Left border */
      object.set({left: surface.left + boundingRectangle.width / 2});
    }
    if (boundingRectangle.top >= surface.top) { /* Top border */
      object.set({top: surface.top + boundingRectangle.height / 2});
    }
    if (boundingRectangle.left + boundingRectangle.width <= surface.left + surface.width) { /* Right border */
      object.set({left: surface.left + surface.width - boundingRectangle.width / 2});
    }
    if (boundingRectangle.top + boundingRectangle.height <= surface.top + surface.height) { /* Bottom border */
      object.set({top: surface.top + surface.height - boundingRectangle.height / 2});
    }
  }

  static restrictRotatingInside(canvas, object, surface): void {
    const boundingRectangle = FabricService.getZoomCompensatedBoundingRect(object, canvas);
    /* left, top, width, height */
    if (FabricService.isInside(boundingRectangle, surface)) {
      object.set({angle: object.lastValidAngle});
    } else {
      object.lastValidAngle = object.angle;
    }
  }

  static restrictScalingInside(canvas, object, surface): void {
    const boundingRectangle = FabricService.getZoomCompensatedBoundingRect(object, canvas);
    /* left, top, width, height */
    if (
      boundingRectangle.left <= surface.left ||
      boundingRectangle.top <= surface.top ||
      boundingRectangle.left + boundingRectangle.width >= surface.left + surface.width ||
      boundingRectangle.top + boundingRectangle.height >= surface.top + surface.height) {
      object.set({
        scaleX: object.lastValidScaleX,
        scaleY: object.lastValidScaleY
      });
    } else {
      object.lastValidScaleX = object.scaleX;
      object.lastValidScaleY = object.scaleY;
    }
  }

  static setClipRegion(object): void {
    object.clipMask.set({
      top: 0, left: 0,
      scaleX: object.width / object.clipMask.width * object.maskZoom,
      scaleY: object.height / object.clipMask.height * object.maskZoom
    });
    object.clipTo = function (ctx) {
      this.clipMask.render(ctx);
      if (this.clipOverlay) {
        ctx.drawImage(
          this.clipOverlay,
          0, 0, this.clipOverlay.width, this.clipOverlay.height,
          -this.width / 2 * this.maskZoom, -this.height / 2 * this.maskZoom, this.width * this.maskZoom, this.height * this.maskZoom
        );
      }
    };
  }

  static updateSourceBox(object): void {
    const elementToDraw = object._element,
      scaleX = object.scaleX,
      scaleY = object.scaleY,
      maxScale = Math.max(scaleX, scaleY),
      multiX = scaleX / maxScale,
      multiY = scaleY / maxScale,
      width = object.sourceZoom * elementToDraw.width * multiX,
      height = object.sourceZoom * elementToDraw.height * multiY;
    object.sourceBox = {
      x: object.sourceCenter.x - width / 2,
      y: object.sourceCenter.y - height / 2,
      width: width,
      height: height
    };
  }

  initCanvas(id: string) {
    this.canvas = new Fabric.Canvas(id);
    this.canvas.setWidth(800);
    this.canvas.setHeight(800);
    this.canvas.setZoom(1);
    this.canvas.setZoom(1);
    this.canvas.requestRenderAll();
    this.canvas.on({
      'selection:created': (e) => {
        this.state.object = e.target;
      },
      'selection:updated': (e) => {
        this.state.object = e.target;
      },
      'selection:cleared': (e) => {
        this.state.object = null;
      }
    });
  }

  loadImage(file): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      LoadImage(file, (img) => {
        resolve(img);
      }, {
        meta: true,
        orientation: true
      });
    });
  }

  loadFont(font): Promise<null> {
    return new Promise((resolve, reject) => {
      WebFont.load({
        custom: {
          families: [font]
        },
        timeout: 5000,
        active: () => {
          resolve();
        },
        inactive: () => {
          reject();
        }
      });
    });
  }

  addBackground(img): void {
    const object = new Fabric.Image(img);
    const canvasRatio = this.canvas.height / this.canvas.width;
    const objectRatio = object.height / object.width;
    object.set({
      $corner: null,
      subtype: 'background',
      lockRotation: true,
      minScaleLimit: 1,
      remoteSrc: false,
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
      width: (canvasRatio < objectRatio) ? this.canvas.width : this.canvas.height / objectRatio,
      height: (canvasRatio < objectRatio) ? this.canvas.width * objectRatio : this.canvas.height,
      sourceBox: {x: 0, y: 0, width: Math.floor(object._element.width), height: Math.floor(object._element.height)},
      sourceCenter: {x: Math.floor(object._element.width / 2), y: Math.floor(object._element.height / 2)},
      sourceZoom: SRC_ZOOM_VALUES[SRC_ZOOM_VALUES.length - 1],
      sourceZoomIndex: SRC_ZOOM_VALUES.length - 1
    });
    this.setBackgroundEventListeners(object);
    const objects = this.canvas.getObjects();
    const index = 0, replace = objects.length && objects[0].subtype === 'background';
    this.canvas.insertAt(object, index, replace);
    this.state.designHasBackground = true;
  }

  addForeground(img): void {
    const object = new Fabric.Image(img);
    const canvasRatio = this.canvas.height / this.canvas.width;
    const objectRatio = object.height / object.width;
    object.set({
      subtype: 'foreground',
      lockRotation: false,
      minScaleLimit: .25,
      remoteSrc: false,
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
      width: (canvasRatio < objectRatio) ? this.canvas.height / 2 / objectRatio : this.canvas.width / 2,
      height: (canvasRatio < objectRatio) ? this.canvas.height / 2 : this.canvas.width / 2 * objectRatio,
      sourceBox: {x: 0, y: 0, width: Math.floor(object._element.width), height: Math.floor(object._element.height)},
      sourceCenter: {x: Math.floor(object._element.width / 2), y: Math.floor(object._element.height / 2)},
      sourceZoom: SRC_ZOOM_VALUES[SRC_ZOOM_VALUES.length - 1],
      sourceZoomIndex: SRC_ZOOM_VALUES.length - 1
    });
    this.setForegroundEventListeners(object);
    const objects = this.canvas.getObjects();
    const text = objects.findIndex(obj => obj.subtype === 'text');
    const index = (text < 0) ? objects.length : text, replace = false;
    this.canvas.insertAt(object, index, replace);
  }

  addText(font) {
    return new Promise((resolve, reject) => {
      this.loadFont(font).then(() => {
        this.translate.get('EDITOR.OPTIONS.HINT_TYPE').subscribe((res: string) => {
          const object = new Fabric.IText(res);
          object.set({
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            fontFamily: font
          });
          this.setTextEventListeners(object);
          const objects = this.canvas.getObjects();
          const index = objects.length, replace = false;
          this.canvas.insertAt(object, index, replace);
          resolve(true);
        });
      }, () => {
        resolve(false);
      });
    });
  }

  clearCanvas(): void {
    this.canvas.clear();
  }

  saveCanvas(canvas = null) {
    return (canvas || this.canvas).toJSON(SAVE_PROPERTIES);
  }

  saveDesign(canvas = null) {
    return (canvas || this.canvas).toDataURL();
  }

  loadDesign(data) {
    this.canvas.loadFromJSON(data, this.canvas.requestRenderAll.bind(this.canvas), (o, object) => {
      this.setEventListeners(object);
    });
  }

  setImageMaskSrc(src, overlay, zoom, render: boolean = true) {
    const object: Fabric.Image = this.canvas.getActiveObject();
    if (!object) {
      return;
    }
    if (!src) {
      object.maskSrc = null;
      object.maskOverlay = null;
      object.clipMask = null;
      object.clipOverlay = null;
      object.clipTo = null;
      this.canvas.requestRenderAll();
    } else {
      object.maskSrc = src;
      object.maskOverlay = overlay;
      object.maskZoom = zoom;
      /* svg */
      Fabric.loadSVGFromURL(object.maskSrc, (objects, options) => {
        object.clipMask = Fabric.util.groupSVGElements(objects, options);
        FabricService.setClipRegion(object);
        this.canvas.requestRenderAll();
      });
    }
    /* overlay */
    if (object.maskOverlay) {
      const overlayPng = document.createElement('img');
      overlayPng.onload = () => {
        object.clipOverlay = overlayPng;
        this.canvas.requestRenderAll();
      };
      overlayPng.src = object.maskOverlay;
    } else {
      object.clipOverlay = null;
    }
  }

  setImageMaskZoom(zoom) {
    const object = this.canvas.getActiveObject();
    if (!(object && object.maskSrc)) {
      return;
    }
    object.maskZoom = zoom;
    FabricService.setClipRegion(object);
    this.canvas.requestRenderAll();
  }

  setTextAlign(value) {
    const object: Fabric.IText = this.canvas.getActiveObject();
    if (!object || object.subtype !== 'text') {
      return;
    }
    object.set('textAlign', value);
    this.canvas.requestRenderAll();
  }

  setTextColor(value) {
    const object: Fabric.IText = this.canvas.getActiveObject();
    if (!object || object.subtype !== 'text') {
      return;
    }
    object.set('fill', value);
    this.canvas.requestRenderAll();
  }

  setTextFont(value) {
    const object: Fabric.IText = this.canvas.getActiveObject();
    if (!object || object.subtype !== 'text') {
      return;
    }
    this.loadFont(value).then(() => {
      object.set('fontFamily', value);
      this.canvas.requestRenderAll();
    });
  }

  setTextShadow(value: boolean) {
    const object: Fabric.IText = this.canvas.getActiveObject();
    if (!object || object.subtype !== 'text') {
      return;
    }
    object.setShadow(value ? 'rgba(0,0,0,0.6) 1px 1px 3px' : null);
    this.canvas.requestRenderAll();
  }

  setTextStyle(value: string) {
    const object: Fabric.IText = this.canvas.getActiveObject();
    if (!object || object.subtype !== 'text') {
      return;
    }
    object.set('fontStyle', value);
    this.canvas.requestRenderAll();
  }

  setTextText(value) {
    const object: Fabric.IText = this.canvas.getActiveObject();
    if (!object || object.subtype !== 'text') {
      return;
    }
    object.set('text', value);
    this.canvas.requestRenderAll();
  }

  setTextWeight(value: string) {
    const object: Fabric.IText = this.canvas.getActiveObject();
    if (!object || object.subtype !== 'text') {
      return;
    }
    object.set('fontWeight', value);
    this.canvas.requestRenderAll();
  }

  // setTextPropertyAndRender(callback, args) {
  //   const object: Fabric.IText = this.canvas.getActiveObject();
  //   if (!object || object.subtype !== 'text') { return; }
  //   if (callback) { callback(...args); }
  //   this.canvas.requestRenderAll();
  // }

  setEventListeners(object) {
    switch (object.subtype) {
      case OBJECTS.BACKGROUND:
        this.setBackgroundEventListeners(object);
        break;
      case OBJECTS.FOREGROUND:
        this.setForegroundEventListeners(object);
        break;
      case OBJECTS.TEXT:
        this.setTextEventListeners(object);
        break;
      default:
        break;
    }
  }

  setBackgroundEventListeners(object) {
    object.on({
      'mousedown': (e) => {
        e.target.$corner = e.target.__corner;
      },
      'moving': (e) => {
        e.target.setCoords();
        FabricService.restrictMovementOutside(this.canvas, e.target, {
          left: 0, top: 0, width: this.canvas.width, height: this.canvas.height
        });
        this.state.object = e.target;
      },
      'scaling': (e) => {
        e.target.setCoords();
        FabricService.preserveAspectRatio(e.target, e.target.$corner);
        FabricService.restrictMovementOutside(this.canvas, e.target, {
          left: 0, top: 0, width: this.canvas.width, height: this.canvas.height
        });
        this.state.object = e.target;
      }
    });
  }

  setForegroundEventListeners(object) {
    object.on({
      'scaling': (e) => {
        e.target.setCoords();
        if (e.target.__corner === 0 || e.target.__corner.slice(0, 1) === 'm') {
          FabricService.checkSourceBorders(e.target);
          FabricService.updateSourceBox(e.target);
        }
        this.state.object = e.target;
      }
    });
  }

  setTextEventListeners(object) {
    const box = {top: 0, left: 0, width: this.canvas.width, height: this.canvas.height};
    object.on({
      'moving': (e) => {
        e.target.setCoords();
        FabricService.restrictMovementInside(this.canvas, e.target, box);
        this.state.object = e.target;
      },
      'rotating': (e) => {
        FabricService.restrictRotatingInside(this.canvas, e.target, box);
        this.state.object = e.target;
      },
      'scaling': (e) => {
        e.target.setCoords();
        FabricService.preserveAspectRatio(e.target, e.target.__corner);
        FabricService.restrictScalingInside(this.canvas, e.target, box);
        this.state.object = e.target;
      }
    });
  }

  // new
  addFromGallery(img) {
    const canvas = new Fabric.Canvas();
    canvas.setWidth(img.width);
    canvas.setHeight(img.height);
    const image = new Fabric.Image(img);
    image.set({
      width: canvas.width,
      height: canvas.height,
      originX: 'left',
      originY: 'top',
      sourceBox: {x: 0, y: 0, width: image._element.width, height: image._element.height},
      sourceCenter: {x: Math.floor(image._element.width / 2), y: Math.floor(image._element.height / 2)},
      sourceZoom: SRC_ZOOM_VALUES[SRC_ZOOM_VALUES.length - 1],
      sourceZoomIndex: SRC_ZOOM_VALUES.length - 1
    });
    canvas.add(image);
    return canvas;
  }
}
