import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IProduct} from '../../shared/data/products';
import {StateService} from '../../core/state.service';
import {DialogItemComponent} from '../dialog-item/dialog-item.component';
import {Point} from '../../shared/models/point';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnDestroy, OnInit {
  public products: IProduct[];
  public design: Observable<string>;
  public colors: string[];
  public coordinates: Point[];
  public enabled: boolean[];
  public locked: boolean[];
  private unsubscribe$ = new Subject();
  constructor(private dialog: MatDialog, private state: StateService) {}
  ngOnInit() {
    this.design = this.state.design$.pipe(map(res => res ? res : ''));
    this.state.colors$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.colors = res;
    });
    this.state.coordinates$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.coordinates = res;
    });
    this.state.enabled$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.enabled = res;
    });
    this.state.locked$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.locked = res;
    });
    this.state.products$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.products = res;
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  onEnableChange(value, index) {
    const enabled = this.enabled.slice();
    enabled[index] = value;
    this.state.enabled = enabled;
  }
  onTileClick(index) {
    if (!this.enabled[index]) { return; }
    this.dialog
      .open(DialogItemComponent, {
        data: {
          product: this.products[index],
          design: this.design,
          coordinates: this.coordinates[index],
          color: this.colors[index],
          locked: this.locked[index]
        }
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const coordinates = this.coordinates.slice();
          coordinates[index] = new Point(res.coordinates.x, res.coordinates.y);
          this.state.coordinates = coordinates;
           this.state.setProductColors(index, res.color);
        }
      });
  }
  onLockedClick(index) {
    const locked = this.locked.slice();
    locked[index] = !locked[index];
    this.state.locked = locked;
  }
  setDimensions(overlay, container, image, product) {
    if (container && overlay) {
      container.style.width = (overlay.clientWidth - 2) + 'px';
      container.style.height = (overlay.clientHeight - 2) + 'px';
    }
    if (image && overlay) {
      const iSize = Math.min(image.naturalWidth, image.naturalHeight);
      const areaWidth = overlay.clientWidth * product.configuration.width / overlay.naturalWidth;
      const areaHeight = overlay.clientHeight * product.configuration.height / overlay.naturalHeight;
      const bleedLeft = product.bleedsInMillimetres.left / product.widthInMillimetres * areaWidth;
      const bleedRight = product.bleedsInMillimetres.right / product.widthInMillimetres * areaWidth;
      const bleedTop = product.bleedsInMillimetres.top / product.heightInMillimetres * areaHeight;
      const bleedBottom = product.bleedsInMillimetres.bottom / product.heightInMillimetres * areaHeight;
      const cSize = Math.max(areaWidth + bleedLeft + bleedRight, areaHeight + bleedTop + bleedBottom);
      const ratio = cSize / iSize;
      image.setAttribute('width', image.naturalWidth * ratio);
      image.setAttribute('height', image.naturalHeight * ratio);
    }
  }
}
