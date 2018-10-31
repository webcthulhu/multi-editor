export const CANVAS = {
  controlsAboveOverlay: true,
  imageSmoothingEnabled: true,
  preserveObjectStacking: true,
  selection: false,
  skipTargetFind: false,
  stateful: false,
  _getActionFromCorner: function(target, corner, e) {
    if (!corner) { return 'drag'; }
    switch (corner) {
      case 'mtr':
        return 'rotate';
      case 'tl':
        return 'drag';
      case 'ml':
      case 'mr':
        return e[this.altActionKey] ? 'skewY' : 'scaleX';
      case 'mt':
      case 'mb':
        return e[this.altActionKey] ? 'skewX' : 'scaleY';
      default:
        return 'scale';
    }
  }
};

export const OBJECT = {
  centeredScaling: true,
  cornerColor: 'rgba(0,0,0,0)',
  cornerSize: 36,
  cornerStyle: 'circle',
  hasBorders: false,
  hoverCursor: 'default',
  isLocked: false,
  lockScalingFlip: true,
  lockSkewingX: true,
  lockSkewingY: true,
  objectCaching: false,
  originX: 'center',
  originY: 'center',
  template: false,
};

export const IMAGE = {
  crossOrigin: 'anonymous',
  isPlaceholder: false,
  remoteSrc: false,
  maskSrc: null,
  maskZoom: 1,
  _render: function (ctx) {
    let elementToDraw;
    if (this.isMoving === false && this.resizeFilters && this.resizeFilters.length && this._needsResize()) {
      elementToDraw = this.applyFilters(this.resizeFilters);
    } else {
      elementToDraw = this._element;
    }
    if (elementToDraw) {
      ctx.drawImage(
        elementToDraw,
        this.sourceBox.x, this.sourceBox.y, this.sourceBox.width, this.sourceBox.height,
        -this.width / 2, -this.height / 2, this.width, this.height
      );
    }
    this._renderStroke(ctx);
  }
};

export const ITEXT = {
  subtype: 'text',
  fill: '#000000',
  fontFamily: 'Open Sans',
  fontSize: 48,
  lineHeight: 0.9,
  padding: 0,
  textAlign: 'center'
};
