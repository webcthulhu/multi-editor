import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IProduct} from '../../shared/data/products';
import {Point} from '../../shared/models/point';

@Component({
  selector: 'app-dialog-item',
  templateUrl: './dialog-item.component.html',
  styleUrls: ['./dialog-item.component.scss']
})
export class DialogItemComponent implements OnDestroy, OnInit {
  public color: string;
  public design: string;
  public palette: string[];
  public product: IProduct;
  public x: number;
  public y: number;
  private locked: boolean;
  private unsubscribe$ = new Subject();

  constructor(public dialogRef: MatDialogRef<DialogItemComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  static getPixelsToPercent(current: number, full: number): number {
    return current / full * 100;
  }

  static getTransformMatrix(element: HTMLElement): number[] {
    return window.getComputedStyle(element).transform
      .slice(7, -1)
      .split(', ')
      .map(i => parseInt(i, 10));
  }

  ngOnInit() {
    this.color = this.data.color;
    this.design = this.data.design;
    this.locked = this.data.locked;
    this.palette = this.data.product.colors;
    this.product = this.data.product;
    this.x = this.data.coordinates.x;
    this.y = this.data.coordinates.y;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onColorSelected(value: string) {
    if (this.locked) { return; }
    this.color = value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {
    this.dialogRef.close({
      color: this.color,
      coordinates: new Point(this.x, this.y)
    });
  }

  onMouseDown(e: MouseEvent, image) {
    e.preventDefault();
    e.stopPropagation();
    if (this.locked) { return; }
    const transform: number[] = DialogItemComponent.getTransformMatrix(image);
    const container: HTMLImageElement = <HTMLImageElement> e.target;
    const areaWidth = container.clientWidth * this.product.configuration.width / container.naturalWidth;
    const areaHeight = container.clientHeight * this.product.configuration.height / container.naturalHeight;
    const bleedLeft = DialogItemComponent
      .getPixelsToPercent(this.product.bleedsInMillimetres.left / this.product.widthInMillimetres * areaWidth, image.clientWidth);
    const bleedRight = DialogItemComponent
      .getPixelsToPercent(this.product.bleedsInMillimetres.right / this.product.widthInMillimetres * areaWidth, image.clientWidth);
    const bleedTop = DialogItemComponent
      .getPixelsToPercent(this.product.bleedsInMillimetres.top / this.product.heightInMillimetres * areaHeight, image.clientWidth);
    const bleedBottom = DialogItemComponent
      .getPixelsToPercent(this.product.bleedsInMillimetres.bottom / this.product.heightInMillimetres * areaHeight, image.clientWidth);
    const width: number = DialogItemComponent
      .getPixelsToPercent(areaWidth / 2, image.clientWidth);
    const height: number = DialogItemComponent
      .getPixelsToPercent(areaHeight / 2, image.clientHeight);
    const box = {
      top: -(height + bleedTop),
      left: -(width + bleedLeft),
      bottom: height + bleedBottom - 100,
      right: width + bleedRight - 100
    };
    this.onMouseMove(image, new Point(e.clientX, e.clientY), transform, box);
    this.onMouseUp();
  }

  onMouseMove(element: HTMLImageElement, mouse: Point, transform, box) {
    fromEvent(document, 'mousemove')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((e: MouseEvent) => {
        const deltaX = e.clientX - mouse.x + transform[4];
        const deltaY = e.clientY - mouse.y + transform[5];
        this.x = DialogItemComponent.getPixelsToPercent(deltaX, element.clientWidth);
        this.y = DialogItemComponent.getPixelsToPercent(deltaY, element.clientHeight);
        if (this.x >= box.left) {
          this.x = box.left;
        } else if (this.x <= box.right) {
          this.x = box.right;
        }
        if (this.y >= box.top) {
          this.y = box.top;
        } else if (this.y <= box.bottom) {
          this.y = box.bottom;
        }
      });
  }

  onMouseUp() {
    fromEvent(document, 'mouseup')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((e: MouseEvent) => {
        e.preventDefault();
        this.unsubscribe$.next();
      });
  }

  setDimensions(overlay, container, image) {
    container.style.width = (overlay.clientWidth - 2) + 'px';
    container.style.height = (overlay.clientHeight - 2) + 'px';
    const iSize = Math.min(image.naturalWidth, image.naturalHeight);
    const areaWidth = overlay.clientWidth * this.product.configuration.width / overlay.naturalWidth;
    const areaHeight = overlay.clientHeight * this.product.configuration.height / overlay.naturalHeight;
    const bleedLeft = this.product.bleedsInMillimetres.left / this.product.widthInMillimetres * areaWidth;
    const bleedRight = this.product.bleedsInMillimetres.right / this.product.widthInMillimetres * areaWidth;
    const bleedTop = this.product.bleedsInMillimetres.top / this.product.heightInMillimetres * areaHeight;
    const bleedBottom = this.product.bleedsInMillimetres.bottom / this.product.heightInMillimetres * areaHeight;
    const cSize = Math.max(areaWidth + bleedLeft + bleedRight, areaHeight + bleedTop + bleedBottom);
    const ratio = cSize / iSize;
    image.setAttribute('width', image.naturalWidth * ratio);
    image.setAttribute('height', image.naturalHeight * ratio);
  }
}


