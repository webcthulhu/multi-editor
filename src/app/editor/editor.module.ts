import {NgModule} from '@angular/core';
import {EditorRoutingModule} from './editor-routing.module';
import {MainComponent} from './main/main.component';
import {ControlsComponent} from './controls/controls.component';
import {OptionsComponent} from './options/options.component';
import {SharedModule} from '../shared/shared.module';
import {IndexComponent} from './index/index.component';
import { ColorpickerComponent } from './colorpicker/colorpicker.component';

@NgModule({
  imports: [
    EditorRoutingModule,
    SharedModule
  ],
  declarations: [
    MainComponent,
    ControlsComponent,
    OptionsComponent,
    IndexComponent,
    ColorpickerComponent
  ]
})
export class EditorModule {
}
