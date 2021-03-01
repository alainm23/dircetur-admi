import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, 
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbSpinnerModule,
  NbListModule,
  NbProgressBarModule,
  NbDialogModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BlogComponent } from './blog.component';
import { BlogRoutingModule } from './blog-routing.module';

import { AgregarBlogComponent } from "./agregar-blog/agregar-blog.component";
import { VerBlogComponent } from './ver-blog/ver-blog.component';
import { EditarEtiquetasComponent } from './editar-etiquetas/editar-etiquetas.component';
import { BlogDetalleComponent } from './blog-detalle/blog-detalle.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbListModule,
    BlogRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NbProgressBarModule,
    CKEditorModule,
    NbDialogModule
  ],
  declarations: [
    BlogComponent,
    AgregarBlogComponent,
    VerBlogComponent,
    EditarEtiquetasComponent,
    BlogDetalleComponent
  ],
})

export class BlogModule { }
