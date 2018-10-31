import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'editor', loadChildren: 'src/app/editor/editor.module#EditorModule'},
  {path: 'gallery', loadChildren: 'src/app/gallery/gallery.module#GalleryModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
