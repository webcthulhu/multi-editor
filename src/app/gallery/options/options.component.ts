import {Component, OnInit} from '@angular/core';
import {RouteService} from '../../core/route.service';
import {FabricService} from '../../core/fabric.service';
import {StateService} from '../../core/state.service';
import {IProduct} from '../../shared/data/products';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  palette: string[];
  constructor(private router: RouteService, private fabric: FabricService, private state: StateService) {
    this.state.products$.subscribe(res => {
      this.palette = res.reduce((acc: string[], cur: IProduct) => {
        return acc.concat(cur.colors.filter(i => acc.indexOf(i) < 0));
      }, []);
    });
  }

  ngOnInit() {
  }

  onUploadChange(e) {
    if (e.target.files[0] && e.target.files[0].type.match('image.*')) {
      this.fabric.loadImage(e.target.files[0]).then((img: HTMLCanvasElement) => {
        this.fabric.clearCanvas();
        this.fabric.addBackground(img);
        const canvas = this.fabric.saveCanvas();
        if (canvas.objects.length > 0) {
          this.state.canvas = canvas;
          this.state.design = this.fabric.saveDesign();
        }
      });
      e.target.value = '';
    }
  }

  onToEditorClick() {
    this.router.navigate('editor');
  }

  onColorSelected(color: string) {
    this.state.colors = color;
  }

  onFinalizeClick() {
    this.state.finalize();
  }
}
