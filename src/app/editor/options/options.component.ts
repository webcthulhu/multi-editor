import {Component, OnInit} from '@angular/core';
import {RouteService} from '../../core/route.service';
import {StateService} from '../../core/state.service';
import {COLORS} from '../../shared/data/colors';
import {FILTERS} from '../../shared/data/filters';
import {FONTS} from '../../shared/data/fonts';
import {FabricService} from '../../core/fabric.service';
import {MASKS, IMask} from '../../shared/data/masks';
import {MatSnackBar} from '@angular/material';

// const COLORS_PER_PAGE = 18;
const MASKS_PER_PAGE = 5;

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  expanded: number = null;
  filters = FILTERS;
  fonts: string[] = FONTS;
  // colors = {
  //   all: <string[][]> [],
  //   selection: <string[]> null,
  //   min: 0,
  //   max: <number> null,
  //   index: 0
  // };
  palette = COLORS;
  mask = {
    src: <string | null> null,
    overlay: <string | null> null,
    zoom: <number> 1
  };
  masks = {
    all: <IMask[][]> [],
    selection: <IMask[]> null,
    minZoom: 0.1,
    maxZoom: 1,
    stepZoom: 0.1,
    minPage: 0,
    maxPage: <number> null,
    indexPage: 0
  };
  designHasBackground;
  object;
  isTypeHintVisible = false;
  constructor(private fabric: FabricService, private router: RouteService, public snackbar: MatSnackBar, private state: StateService) {
    // for (let i = 0, j = COLORS.length; i < j; i += COLORS_PER_PAGE) {
    //   this.colors.all.push(COLORS.slice(i, i + COLORS_PER_PAGE));
    // }
    // this.colors.selection = this.colors.all[this.colors.index];
    // this.colors.max = this.colors.all.length - 1;
    for (let i = 0, j = MASKS.length; i < j; i += MASKS_PER_PAGE) {
      this.masks.all.push(MASKS.slice(i, i + MASKS_PER_PAGE));
    }
    this.masks.selection = this.masks.all[0];
    this.masks.maxPage = this.masks.all.length - 1;
  }

  ngOnInit() {
    this.designHasBackground = this.state.designHasBackground$;
    this.object = this.state.object$;
  }

  addBackground(e): void {
    if (e.target.files[0] && e.target.files[0].type.match('image.*')) {
      this.fabric.loadImage(e.target.files[0]).then(img => {
        this.fabric.addBackground(img);
      });
      e.target.value = '';
    }
  }

  addForeground(e): void {
    if (e.target.files[0] && e.target.files[0].type.match('image.*')) {
      this.fabric.loadImage(e.target.files[0]).then(img => {
        this.fabric.addForeground(img);
      });
      e.target.value = '';
    }
  }

  addText(): void {
    this.fabric.addText(this.fonts[0]).then(res => {
      if (!res) {
        this.snackbar.open('Font can\'t be loaded.', 'OK', {duration: 2000});
      }
    });
  }

  clearCanvas(): void {
    this.fabric.clearCanvas();
    this.state.canvas = null;
    this.state.design = null;
  }

  replaceImage(e) {
  }

  save(): void {
    const canvas = this.fabric.saveCanvas();
    if (canvas.objects.length) {
      this.state.canvas = canvas;
      this.state.design = this.fabric.saveDesign();
    }
    this.router.navigate('gallery');
  }

  onFontStyleChange(value: string[]): void { /* bold, italic, underline */
    this.fabric.setTextWeight(value.includes('bold') ? 'bold' : 'normal'); /* normal / bold */
    this.fabric.setTextStyle(value.includes('italic') ? 'italic' : 'normal'); /* normal / italic */
    this.fabric.setTextShadow(value.includes('shadow'));
  }

  onTextChange(e) {
    console.log(e);
  }
  setImageFilter(value) {}
  setImageMaskSrc(): void {
    this.fabric.setImageMaskSrc(this.mask.src, this.mask.overlay, this.mask.zoom);
  }
  setImageMaskZoom(): void {
    this.fabric.setImageMaskZoom(this.mask.zoom);
  }
  setTextAlign(value): void {
    this.fabric.setTextAlign(value);
  }
  setTextColor(value): void {
    this.fabric.setTextColor(value);
  }
  setTextFont(value): void {
    this.fabric.setTextFont(value);
  }
  setTextText(value): void {
    this.fabric.setTextText(value);
  }
}
