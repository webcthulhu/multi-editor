export interface IProduct {
  id: string;
  name: string;
  description: string;
  widthInMillimetres: number;
  heightInMillimetres: number;
  bleedsInMillimetres: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
  overlay: string;
  configuration: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  colors?: string[];
}

export const PRODUCTS = [
  {
    id: '001',
    name: 'Square Tile',
    description: 'Square tile (150 x 150 mm)',
    widthInMillimetres: 150,
    heightInMillimetres: 150,
    bleedsInMillimetres: {
      top: 10,
      left: 10,
      bottom: 10,
      right: 10
    },
    overlay: 'over-001.png',
    configuration: {
      top: 11,
      left: 11,
      width: 578,
      height: 578
    },
    colors: [
      '#000000', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3f51b5'
    ]
  },
  {
    id: '002',
    name: 'Rectangular Tile (Portrait)',
    description: 'Portrait tile (100 x 150 mm)',
    widthInMillimetres: 100,
    heightInMillimetres: 150,
    bleedsInMillimetres: {
      top: 10,
      left: 10,
      bottom: 10,
      right: 10
    },
    overlay: 'over-002.png',
    configuration: {
      top: 14,
      left: 14,
      width: 571,
      height: 856
    },
    colors: [
      '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#CDDC39', '#ffeb3b'
    ]
  },
  {
    id: '003',
    name: 'Rectangular Tile (Landscape)',
    description: 'Landscape tile (150 x 100 mm)',
    widthInMillimetres: 150,
    heightInMillimetres: 100,
    bleedsInMillimetres: {
      top: 10,
      left: 10,
      bottom: 10,
      right: 10
    },
    overlay: 'over-003.png',
    configuration: {
      top: 14,
      left: 14,
      width: 856,
      height: 571
    },
    colors: [
      '#BF360C', '#3E2723', '#212121'
    ]
  },
  {
    id: '004',
    name: 'iPhone 7',
    description: 'iPhone 7 case (1383 x 671 mm)',
    widthInMillimetres: 1383,
    heightInMillimetres: 671,
    bleedsInMillimetres: {
      top: 3,
      left: 3,
      bottom: 3,
      right: 3
    },
    overlay: 'over-004.png',
    configuration: {
      top: 29,
      left: 28,
      width: 970,
      height: 2010
    },
    colors: [
      '#FFFF00', '#FFAB40', '#FF3D00'
    ]
  },
  {
    id: '005',
    name: 'Flip Flops',
    description: 'Flip Flops (1383 x 671 mm)',
    widthInMillimetres: 525,
    heightInMillimetres: 1342,
    bleedsInMillimetres: {
      top: 3,
      left: 3,
      bottom: 3,
      right: 3
    },
    overlay: 'over-005.png',
    configuration: {
      top: 22,
      left: 22,
      width: 525,
      height: 1342
    },
    colors: [
      '#9FA8DA', '#90CAF9', '#81D4FA', '#80DEEA', '#80CBC4', '#A5D6A7', '#C5E1A5', '#E6EE9C', '#FFF59D', '#FFE082',
      '#FFCC80', '#FFAB91', '#BCAAA4', '#EEEEEE', '#B0BEC5'
    ]
  },
  {
    id: '006',
    name: 'Clock',
    description: '',
    widthInMillimetres: 430,
    heightInMillimetres: 435,
    bleedsInMillimetres: {
      top: 3,
      left: 3,
      bottom: 3,
      right: 3
    },
    overlay: 'clock.png',
    configuration: {
      top: 54,
      left: 84,
      width: 430,
      height: 435
    },
    colors: [
      '#9e9e9e', '#607D8B', '#EF9A9A', '#F48FB1', '#CE93D8', '#B39DDB', '#9FA8DA', '#90CAF9', '#81D4FA', '#80DEEA'
    ]
  },
  {
    id: '007',
    name: 'Laptop',
    description: '',
    widthInMillimetres: 480,
    heightInMillimetres: 328,
    bleedsInMillimetres: {
      top: 3,
      left: 3,
      bottom: 3,
      right: 3
    },
    overlay: 'laptop.png',
    configuration: {
      top: 54,
      left: 30,
      width: 240,
      height: 164
    },
    colors: [
      '#B0BEC5', '#B71C1C', '#880E4F'
    ]
  },
  {
    id: '008',
    name: 'Notebook',
    description: '',
    widthInMillimetres: 222,
    heightInMillimetres: 312,
    bleedsInMillimetres: {
      top: 3,
      left: 3,
      bottom: 3,
      right: 3
    },
    overlay: 'notebook.png',
    configuration: {
      top: 32,
      left: 74,
      width: 148,
      height: 208
    },
    colors: [
      '#E91E63', '#9C27B0', '#673AB7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a',
      '#CDDC39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
    ]
  },
  {
    id: '009',
    name: 'Phone',
    description: '',
    widthInMillimetres: 60.5,
    heightInMillimetres: 126,
    bleedsInMillimetres: {
      top: 3,
      left: 3,
      bottom: 3,
      right: 3
    },
    overlay: 'phone.png',
    configuration: {
      top: 10,
      left: 89,
      width: 121,
      height: 252
    },
    colors: [
      '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607D8B', '#EF9A9A', '#F48FB1', '#CE93D8'
    ]
  },
  {
    id: '010',
    name: 'Pillow',
    description: '',
    widthInMillimetres: 300,
    heightInMillimetres: 300,
    bleedsInMillimetres: {
      top: 3,
      left: 3,
      bottom: 3,
      right: 3
    },
    overlay: 'pillow.png',
    configuration: {
      top: 8,
      left: 22,
      width: 256,
      height: 254
    },
    colors: [
      '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100'
    ]
  },
  {
    id: '011',
    name: 'T-Shirt',
    description: '',
    widthInMillimetres: 586,
    heightInMillimetres: 526,
    bleedsInMillimetres: {
      top: 3,
      left: 3,
      bottom: 3,
      right: 3
    },
    overlay: 'tshirt.png',
    configuration: {
      top: 17,
      left: 17,
      width: 295,
      height: 263
    },
    colors: [
      '#212121', '#263238', '#FFFFFF', '#FF1744'
    ]
  },
  {
    id: '012',
    name: 'T-Shirt',
    description: '',
    widthInMillimetres: 586,
    heightInMillimetres: 526,
    bleedsInMillimetres: {
      top: 3,
      left: 3,
      bottom: 3,
      right: 3
    },
    overlay: 'tshirt.png',
    configuration: {
      top: 107,
      left: 107,
      width: 63,
      height: 63
    },
    colors: [
      '#212121', '#263238', '#FFFFFF', '#FF1744'
    ]
  }
];
