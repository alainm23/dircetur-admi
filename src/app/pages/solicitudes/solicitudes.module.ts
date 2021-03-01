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
  NbStepperModule,
  NbTreeGridModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SolicitudesComponent } from './solicitudes.component';
import { SolicitudesRoutingModule } from './solicitudes-routing.module';

import { AgregarSolicitudComponent } from "./agregar-solicitud/agregar-solicitud.component";

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ListarSolicitanteComponent } from './listar-solicitante/listar-solicitante.component';
import { EditarSolicitanteComponent } from './editar-solicitante/editar-solicitante.component';
import { RegistrarSolicitudComponent } from './registrar-solicitud/registrar-solicitud.component';
import { EditarSolicitudComponent } from './editar-solicitud/editar-solicitud.component';
import { ListarSolicitudesComponent } from './listar-solicitudes/listar-solicitudes.component';
import { AllSolicitudesComponent } from './all-solicitudes/all-solicitudes.component';
import { RegistrarSolicitudv2Component } from './registrar-solicitudv2/registrar-solicitudv2.component';
import { ProcesarSolicitudesComponent } from './procesar-solicitudes/procesar-solicitudes.component';
import { OrderModule } from 'ngx-order-pipe';
import { ReporteGeneralComponent } from './reporte-general/reporte-general.component';


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
    SolicitudesRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NbProgressBarModule,
    CKEditorModule,
    NbDialogModule,
    NbStepperModule,
    NbTreeGridModule,
    OrderModule
  ],
  declarations: [
    SolicitudesComponent,
    AgregarSolicitudComponent,
    ListarSolicitanteComponent,
    EditarSolicitanteComponent,
    RegistrarSolicitudComponent,
    EditarSolicitudComponent,
    ListarSolicitudesComponent,
    AllSolicitudesComponent,
    RegistrarSolicitudv2Component,
    ProcesarSolicitudesComponent,
    ReporteGeneralComponent
  ],
})

export class SolicitudesModule { }
