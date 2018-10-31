import { environment } from '../../../environments/environment';

const API_SERVER_URLS = {
  'production': 'https://api.ontwerptool.nl/editor-api/',
  'development': 'http://35.156.5.236:3349/editor-api/',
  'testing': 'http://52.57.211.240:3349/editor-api/'
};
const ASSETS_SERVER_URLS = {
  'production': 'https://s3.eu-central-1.amazonaws.com/multi-product-editor-pictures/assets/',
  'development': 'https://s3.eu-central-1.amazonaws.com/multi-product-editor-dev/assets/',
  'testing': 'https://s3.eu-central-1.amazonaws.com/multi-product-editor-test/assets/'
};

export const CONFIG = {
  API: API_SERVER_URLS[environment.production ? 'production' : 'development'],
  ASSETS: ASSETS_SERVER_URLS[environment.production ? 'production' : 'development']
};

export const SAVE_PROPERTIES: string[] = [
  'crossOrigin',
  'lockMovementX',
  'lockMovementY',
  'lockRotation',
  'lockScalingX',
  'lockScalingY',
  'lockedWidth',
  'maskSrc',
  'maskOverlay',
  'maskZoom',
  'minScaleLimit',
  'originX',
  'originY',
  'remoteSrc',
  'selectable',
  'sourceBox',
  'sourceCenter',
  'sourceZoom',
  'sourceZoomIndex',
  'subtype',
  'imageNaturalWidth',
  'isLocked',
  'isPlaceholder',
  'isTemplate'
];
