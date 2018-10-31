import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';
import {TranslateModule} from '@ngx-translate/core';
import {ColorSelectorComponent} from './components/color-selector/color-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    ColorSelectorComponent
  ],
  declarations: [
    ColorSelectorComponent
  ]
})
export class SharedModule {
}
