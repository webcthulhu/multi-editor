import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {StateService} from '../../core/state.service';
import {FabricService} from '../../core/fabric.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsComponent implements OnInit {
  @Output() actions = new EventEmitter();
  public top = 0;
  public left = 0;
  public width = 0;
  public height = 0;
  public object$;
  constructor(private state: StateService, private fabric: FabricService) {}
  ngOnInit() {
    this.object$ = this.state.object$;
  }
  getBoxPositionStyle(object) {
    const wrapper = this.fabric.canvas.wrapperEl.getBoundingClientRect();
    const ratio = wrapper.width / this.fabric.canvas.width;
    return {
      'top': `${wrapper.top + object.top * ratio}px`,
      'left': `${wrapper.left + object.left * ratio}px`,
      'width': `${object.width * object.scaleX * ratio}px`,
      'height': `${object.height * object.scaleY * ratio}px`,
      'transform': `translate(-50%, -50%) rotate(${object.angle}deg)`
    };
  }
  isNotText(object) {
    return object.type !== 'i-text';
  }
}
