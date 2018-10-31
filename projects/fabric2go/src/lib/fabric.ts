import {fabric as Fabric} from 'fabric';
import {CANVAS, IMAGE, OBJECT, ITEXT} from './config';

Fabric.util.object.extend(Fabric.Canvas.prototype, CANVAS);
Fabric.util.object.extend(Fabric.Object.prototype, OBJECT);
Fabric.util.object.extend(Fabric.Image.prototype, IMAGE);
Fabric.util.object.extend(Fabric.IText.prototype, ITEXT);
Fabric.IText.prototype.setControlsVisibility({mt: false, mb: false, mr: false, ml: false, tr: false});

// OriginalBackground
// OriginalForeground
// OriginalText
// CollageCell
// CollagePhoto
// CollageInspiration

export {Fabric};
