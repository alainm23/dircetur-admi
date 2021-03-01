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
  NbDialogModule,
  NbCalendarModule,
  NbToggleModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventosComponent } from './eventos.component';
import { EventosRoutingModule } from './eventos-routing.module';


import { AgregarEventosComponent } from "./agregar-eventos/agregar-eventos.component";
import { VerEventosComponent } from './ver-eventos/ver-eventos.component';
import { EditarTiposComponent } from './editar-tipos/editar-tipos.component';
import { EventoDetalleComponent } from './evento-detalle/evento-detalle.component';

// Editor
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
    EventosRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    NbCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    NbProgressBarModule,
    NbDialogModule,
    CKEditorModule,
    NbToggleModule
  ],
  declarations: [
    EventosComponent,
    AgregarEventosComponent,
    VerEventosComponent,
    EditarTiposComponent,
    EventoDetalleComponent
  ],
})

export class EventosModule { }
