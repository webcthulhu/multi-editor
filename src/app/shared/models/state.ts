import {Point} from './point';
import {IProduct} from '../data/products';

export interface IState {
  busy: boolean;
  colors: string[];
  coordinates: Point[];
  enabled: boolean[];
  locked: boolean[];
  canvas: any;
  designHasBackground: boolean;
  design: string;
  object: any;
  products: IProduct[];
}

export interface IOptions {
  busy?: boolean;
  colors?: string[];
  coordinates?: Point[];
  enabled?: boolean[];
  locked?: boolean[];
  canvas?: any;
  designHasBackground?: boolean;
  design?: string;
  object?: any;
  products?: any;
}

export class State implements IState {
  busy: boolean;
  colors: string[];
  coordinates: Point[];
  enabled: boolean[];
  locked: boolean[];
  canvas: any;
  designHasBackground: boolean;
  design: string;
  object: any;
  products: IProduct[];
  constructor(options: IOptions = {}) {
    this.products = options.products || [];
    this.colors = options.colors || State.getDefaultColors(this.products);
    this.coordinates = options.coordinates || State.getDefaultCoordinates(this.products);
    this.enabled = options.enabled || State.getDefaultEnabled(this.products);
    this.locked = options.locked || State.getDefaultLocked(this.products);
    this.busy = false;
    this.canvas = null;
    this.design = null;
    this.designHasBackground = false;
    this.object = null;
  }
  static getDefaultColors(products): string[] {
    return Array(products.length).fill('#FFFFFF');
  }
  static getDefaultCoordinates(products): Point[] {
    return Array(products.length).fill(new Point(-50, -50));
  }
  static getDefaultEnabled(products): boolean[] {
    return Array(products.length).fill(true);
  }
  static getDefaultLocked(products): boolean[] {
    return Array(products.length).fill(false);
  }
  static getMergedCoordinates(set1: Point[], set2: Point[]): Point[] {
    const len = Math.min(set1.length, set2.length);
    for (let i = 0; i < len; i++) {
      set1[i] = set2[i];
    }
    return set1;
  }
}
