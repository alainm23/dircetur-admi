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

import { CapacitacionesComponent } from './capacitaciones.component';
import { CapacitacionesRoutingModule } from './capacitaciones-routing.module';

import { AgregarCapaComponent } from "./agregar-capa/agregar-capa.component";

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ListarCapasComponent } from './listar-capas/listar-capas.component';
import { CapaDetalleComponent } from './capa-detalle/capa-detalle.component';

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
    CapacitacionesRoutingModule,
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
    CapacitacionesComponent,
    AgregarCapaComponent,
    ListarCapasComponent,
    CapaDetalleComponent
  ],
})

export class CapacitacionesModule { }
