import {NgModule} from '@angular/core';

import {GalleryRoutingModule} from './gallery-routing.module';
import {MainComponent} from './main/main.component';
import {OptionsComponent} from './options/options.component';
import {IndexComponent} from './index/index.component';
import {SharedModule} from '../shared/shared.module';
import {DialogItemComponent} from './dialog-item/dialog-item.component';

@NgModule({
  imports: [
    GalleryRoutingModule,
    SharedModule
  ],
  declarations: [
    MainComponent,
    OptionsComponent,
    IndexComponent,
    DialogItemComponent
  ],
  entryComponents: [
    DialogItemComponent
  ]
})
export class GalleryModule {
}
