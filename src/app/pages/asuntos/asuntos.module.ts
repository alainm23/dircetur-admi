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

import { AsuntosComponent } from './asuntos.component';
import { AsuntosRoutingModule } from './asuntos-routing.module';


import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AgregarAsuntoComponent } from './agregar-asunto/agregar-asunto.component';
import { AsuntoDetalleComponent } from './asunto-detalle/asunto-detalle.component';
import { ListarAsuntosComponent } from './listar-asuntos/listar-asuntos.component';

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
    AsuntosRoutingModule,
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
    AsuntosComponent,
    AgregarAsuntoComponent,
    AsuntoDetalleComponent,
    ListarAsuntosComponent
  ],
})

export class AsuntosModule { }
