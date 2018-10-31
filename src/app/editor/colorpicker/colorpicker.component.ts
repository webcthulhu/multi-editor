import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss']
})
export class ColorpickerComponent implements OnInit, OnChanges {
  @Input('color') set color(value) {
    this.initialColor = ColorpickerComponent.isValidHex(value) ? value : '#000000';
    this.setColor(this.initialColor);
  }
  @Output('change') change = new EventEmitter();
  initialColor = '';
  // private isInitialized = false;
  private colorElement: HTMLElement;
  private wheelElement: HTMLElement;
  private hMarkerElement: HTMLElement;
  private slMarkerElement: HTMLElement;
  private radius = 84;
  private square = 100;
  private width = 194;
  private hex: any;
  private rgb: any;
  private hsl: any;
  private circleDrag: any;
  private unsubscribe$ = new Subject();

  constructor(public element: ElementRef) {
  }

  static absolutePosition(el) {
    const r = {
      x: el.offsetLeft,
      y: el.offsetTop
    };
    if (el.offsetParent) {
      const tmp = ColorpickerComponent.absolutePosition(el.offsetParent);
      r.x += tmp.x;
      r.y += tmp.y;
    }
    return r;
  }

  static RGBToHex(rgb) {
    const r = Math.round(rgb[0] * 255);
    const g = Math.round(rgb[1] * 255);
    const b = Math.round(rgb[2] * 255);
    return '#' + (r < 16 ? '0' : '') + r.toString(16) + (g < 16 ? '0' : '') + g.toString(16) + (b < 16 ? '0' : '') + b.toString(16);
  }

  static HexToRGB(color) {
    if (color.length === 7) {
      return [parseInt('0x' + color.substring(1, 3), 16) / 255,
        parseInt('0x' + color.substring(3, 5), 16) / 255,
        parseInt('0x' + color.substring(5, 7), 16) / 255];
    } else if (color.length === 4) {
      return [parseInt('0x' + color.substring(1, 2), 16) / 15,
        parseInt('0x' + color.substring(2, 3), 16) / 15,
        parseInt('0x' + color.substring(3, 4), 16) / 15];
    }
  }

  static HSLToRGB(hsl) {
    let m1, m2;
    const h = hsl[0], s = hsl[1], l = hsl[2];
    m2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
    m1 = l * 2 - m2;
    return [this.hueToRGB(m1, m2, h + 0.33333),
      this.hueToRGB(m1, m2, h),
      this.hueToRGB(m1, m2, h - 0.33333)];
  }

  static hueToRGB(m1, m2, h) {
    h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
    if (h * 6 < 1) {
      return m1 + (m2 - m1) * h * 6;
    }
    if (h * 2 < 1) {
      return m2;
    }
    if (h * 3 < 2) {
      return m1 + (m2 - m1) * (0.66666 - h) * 6;
    }
    return m1;
  }

  static RGBToHSL(rgb) {
    let min, max, delta, h, s, l;
    const r = rgb[0], g = rgb[1], b = rgb[2];
    min = Math.min(r, Math.min(g, b));
    max = Math.max(r, Math.max(g, b));
    delta = max - min;
    l = (min + max) / 2;
    s = 0;
    if (l > 0 && l < 1) {
      s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
    }
    h = 0;
    if (delta > 0) {
      if (max === r && max !== g) {
        h += (g - b) / delta;
      }
      if (max === g && max !== b) {
        h += (2 + (b - r) / delta);
      }
      if (max === b && max !== r) {
        h += (4 + (r - g) / delta);
      }
      h /= 6;
    }
    return [h, s, l];
  }

  static isValidHex(hex) {
    return /^(#?)([0-9A-F]{6})$/i.test(hex);
  }

  @HostListener('mousedown', ['$event'])
  private onMouseDown(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const pos = this.widgetCoords(e);
    this.circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) * 2 > this.square;
    this.onMouseMove(e);
    this.onMouseUp();
  }

  private onMouseMove(target) {
    fromEvent(document, 'mousemove')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((e: MouseEvent) => {
        const pos = this.widgetCoords(e);
        if (this.circleDrag) {
          let hue = Math.atan2(pos.x, -pos.y) / 6.28;
          if (hue < 0) {
            hue += 1;
          }
          this.setHSL([hue, this.hsl[1], this.hsl[2]]);
        } else {
          const sat = Math.max(0, Math.min(1, -(pos.x / this.square) + .5));
          const lum = Math.max(0, Math.min(1, -(pos.y / this.square) + .5));
          this.setHSL([this.hsl[0], sat, lum]);
        }
        this.change.emit(this.hex);
      });
  }

  private onMouseUp() {
    fromEvent(document, 'mouseup')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((e: MouseEvent) => {
        e.preventDefault();
        this.unsubscribe$.next();
      });
  }

  ngOnInit(): void {
    this.colorElement = this.element.nativeElement.children['color'];
    this.wheelElement = this.element.nativeElement.children['wheel'];
    this.hMarkerElement = this.element.nativeElement.children['h-marker'];
    this.slMarkerElement = this.element.nativeElement.children['sl-marker'];
    // this.initialColor = ColorpickerComponent.isValidHex(this.initialColor) ? this.initialColor : '#000000';
    // this.setColor(this.initialColor);
    // this.isInitialized = true;
  }

  ngOnChanges(changes: any) {
    // if (changes.initialColor && ColorpickerComponent.isValidHex(changes.initialColor.currentValue)) {
    //   this.initialColor = changes.initialColor.currentValue;
    //   if (this.isInitialized) {
    //     this.setColor(this.initialColor);
    //   }
    // }
  }

  setColor(color): void {
    const unpack = ColorpickerComponent.HexToRGB(color);
    if (this.hex !== color && unpack) {
      this.hex = color;
      this.rgb = unpack;
      this.hsl = ColorpickerComponent.RGBToHSL(this.rgb);
      this.updateDisplay();
    }
  }

  setHSL(hsl): void {
    this.hsl = hsl;
    this.rgb = ColorpickerComponent.HSLToRGB(hsl);
    this.hex = ColorpickerComponent.RGBToHex(this.rgb);
    this.updateDisplay();
  }

  widgetCoords(event) {
    let x, y;
    const el = event.target || event.srcElement;
    const reference = this.wheelElement;
    if (typeof event.offsetX !== 'undefined') {
      const pos = {
        x: event.offsetX,
        y: event.offsetY
      };
      let e = el;
      while (e) {
        e.mouseX = pos.x;
        e.mouseY = pos.y;
        pos.x += e.offsetLeft;
        pos.y += e.offsetTop;
        e = e.offsetParent;
      }
      e = reference;
      const offset = {
        x: 0,
        y: 0
      };
      while (e) {
        if (typeof e.mouseX !== 'undefined') {
          x = e.mouseX - offset.x;
          y = e.mouseY - offset.y;
          break;
        }
        offset.x += e.offsetLeft;
        offset.y += e.offsetTop;
        e = e.offsetParent;
      }
      e = el;
      while (e) {
        e.mouseX = undefined;
        e.mouseY = undefined;
        e = e.offsetParent;
      }
    } else {
      const pos = ColorpickerComponent.absolutePosition(reference);
      x = (event.pageX || -pos.x);
      y = (event.pageY || -pos.y);
    }
    return {
      x: x - this.width / 2,
      y: y - this.width / 2
    };
  }

  updateDisplay(): void {
    const angle = this.hsl[0] * 6.28;
    this.hMarkerElement.style.left = Math.round(Math.sin(angle) * this.radius + this.width / 2) + 'px';
    this.hMarkerElement.style.top = Math.round(-Math.cos(angle) * this.radius + this.width / 2) + 'px';
    this.slMarkerElement.style.left = Math.round(this.square * (.5 - this.hsl[1]) + this.width / 2) + 'px';
    this.slMarkerElement.style.top = Math.round(this.square * (.5 - this.hsl[2]) + this.width / 2) + 'px';
    this.colorElement.style.backgroundColor = ColorpickerComponent.RGBToHex(ColorpickerComponent.HSLToRGB([this.hsl[0], 1, 0.5]));
  }
}
