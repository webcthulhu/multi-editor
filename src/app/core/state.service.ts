import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {DesignToProduct, IDesignToProduct} from '../shared/models/design-to-product';
import {State, IState} from '../shared/models/state';
import {ApiService} from './api.service';
import {share} from 'rxjs/internal/operators';
import {FabricService} from './fabric.service';

const SAVE_KEYS = [
  'canvas',
  'coordinates',
  'design'
];

@Injectable({
  providedIn: 'root'
})
export class StateService {
  state: IState = new State();
  private stateSource: BehaviorSubject<any> = new BehaviorSubject(this.state);
  private stateObservable: Observable<any> = this.stateSource.asObservable();

  constructor(private api: ApiService) {
    // Load initial state items from local storage.
    const canvas = JSON.parse(window.localStorage.getItem('canvas'));
    const coordinates = JSON.parse(window.localStorage.getItem('coordinates'));
    const design = JSON.parse(window.localStorage.getItem('design'));
    if (canvas) {
      this.state.canvas = canvas;
    }
    if (coordinates) {
      this.state.coordinates = State.getMergedCoordinates(this.state.coordinates, coordinates);
    }
    if (design) {
      this.state.design = design;
    }
    // Save state items on state changes
    this.state$.subscribe((res: IState) => {
      SAVE_KEYS.forEach(i => {
        window.localStorage.setItem(i, JSON.stringify(res[i]));
      });
    });
    // Api Service
    this.api.getProducts().subscribe(res => {
      this.state = new State({products: res});
      this.stateSource.next(this.state);
    });
  }

  get canvas$() {
    return this.stateObservable.pipe(
      map((state: IState) => state.canvas),
      distinctUntilChanged()
    );
  }

  get colors$() {
    return this.stateObservable.pipe(map((state: IState) => state.colors));
  }

  get coordinates$() {
    return this.stateObservable.pipe(map((state: IState) => state.coordinates));
  }

  get enabled$(): Observable<boolean[]> {
    return this.stateObservable.pipe(map((state: IState) => state.enabled));
  }

  get locked$(): Observable<boolean[]> {
    return this.stateObservable.pipe(map((state: IState) => state.locked));
  }

  get design$() {
    return this.stateObservable.pipe(map((state: IState) => state.design));
  }

  get designHasBackground$() {
    return this.stateObservable.pipe(map((state: IState) => state.designHasBackground));
  }

  get object$() {
    return this.stateObservable.pipe(map((state: IState) => state.object));
  }

  get products$() {
    return this.stateObservable.pipe(map((state: IState) => state.products), share());
  }

  get state$() {
    return this.stateObservable;
  }

  set canvas(value) {
    this.state.canvas = value;
    this.stateSource.next(this.state);
  }

  set colors(value: string) {
    this.state.colors = this.state.colors
      .slice()
      .map((color, i) => (this.state.products[i].colors.includes(value) && !this.state.locked[i]) ? value : color);
    this.stateSource.next(this.state);
  }

  set coordinates(value) {
    this.state.coordinates = value;
    this.stateSource.next(this.state);
  }

  set enabled(value) {
    this.state.enabled = value;
    this.stateSource.next(this.state);
  }

  set locked(value) {
    this.state.locked = value;
    this.stateSource.next(this.state);
  }

  set design(value) {
    this.state.design = value;
    this.state.coordinates = State.getDefaultCoordinates(this.state.products);
    this.stateSource.next(this.state);
  }

  set designHasBackground(value) {
    this.state.designHasBackground = value;
    this.stateSource.next(this.state);
  }

  set object(value) {
    this.state.object = value;
    this.stateSource.next(this.state);
  }

  finalize() {
    const designToProducts = {};
    this.state.products.forEach((product, index: number) => {
      designToProducts[product.id] = new DesignToProduct({
        enabled: this.state.enabled[index],
        offsetX: this.state.coordinates[index].x,
        offsetY: this.state.coordinates[index].y,
        color: this.state.colors[index]
      });
    });
    this.api.postDesign({
      canvas: this.state.canvas,
      designToProducts: designToProducts
    });
  }

  setProductColors(index, color) {
    this.state.colors[index] = color;
    this.stateSource.next(this.state);
  }
}
