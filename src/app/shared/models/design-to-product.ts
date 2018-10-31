export interface IDesignToProduct {
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  color: string;
}

export class DesignToProduct implements IDesignToProduct {
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  color: string;
  constructor(options) {
    this.enabled = options.enabled;
    this.offsetX = options.offsetX;
    this.offsetY = options.offsetY;
    this.color = options.color;
  }
}
