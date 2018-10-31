import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil, debounceTime} from 'rxjs/operators';
import {FabricService} from '../../core/fabric.service';
import {StateService} from '../../core/state.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnDestroy, OnInit {
  private unsubscribe$ = new Subject();

  constructor(private el: ElementRef, private fabric: FabricService, private state: StateService, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.fabric.initCanvas('fabric-canvas');
    this.state.canvas$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(res => this.fabric.loadDesign(res));
    fromEvent(window, 'resize').pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(100),
    ).subscribe(() => this.onResize());
    this.onResize();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onResize() {
    const canvas = this.fabric.canvas;
    const parentEl = this.el.nativeElement;
    const size = Math.min(parentEl.clientWidth, parentEl.clientHeight) - 30;
    this.renderer.setStyle(canvas.wrapperEl, 'width', `${size}px`);
    this.renderer.setStyle(canvas.wrapperEl, 'height', `${size}px`);
    this.renderer.setStyle(canvas.lowerCanvasEl, 'width', `${size}px`);
    this.renderer.setStyle(canvas.lowerCanvasEl, 'height', `${size}px`);
    this.renderer.setStyle(canvas.upperCanvasEl, 'width', `${size}px`);
    this.renderer.setStyle(canvas.upperCanvasEl, 'height', `${size}px`);
  }
}
