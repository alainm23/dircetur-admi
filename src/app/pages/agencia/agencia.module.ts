import { NgModule } from '@angular/core';

import {
  NbActionsModule,
  NbRadioModule,
  NbDialogModule,
  NbAlertModule,
  NbTooltipModule,
  NbMenuModule,
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbIconModule,
  NbSpinnerModule,
  NbSelectModule,
  NbBadgeModule,
  NbListModule,
  NbAccordionModule,
  NbTreeGridModule,
  NbDatepickerModule,
  NbToggleModule,
  NbPopoverModule,
  NbUserModule,
  NbLayoutModule,
  NbSidebarModule,
  NbCheckboxModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { AgenciaRoutingModule } from './agencia-routing.module';
import { AgenciaComponent } from './agencia.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgregarAgenciaComponent } from './agregar-agencia/agregar-agencia.component';
import { EditarClasificacionComponent } from './editar-clasificacion/editar-clasificacion.component';
import { EditarTiposTurismoComponent } from './editar-tipos-turismo/editar-tipos-turismo.component';
import { ListaAgenciasComponent } from './lista-agencias/lista-agencias.component';
import { AgenciaDetalleComponent } from './agencia-detalle/agencia-detalle.component';
import { ReconocimientosCrudComponent } from './reconocimientos-crud/reconocimientos-crud.component';
import { SacionesCrudComponent } from './saciones-crud/saciones-crud.component';
import { RechazosComponent } from './rechazos/rechazos.component';

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
    AgenciaRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NbAccordionModule,
    NbDialogModule,
    NbAlertModule,
    NbTooltipModule,
    NbPopoverModule,
    NbToggleModule,
    NbTreeGridModule,
    NbMenuModule,
    NbBadgeModule,
    NbLayoutModule,
    NbSidebarModule
  ],
  declarations: [
    AgenciaComponent,
    AgregarAgenciaComponent,
    EditarClasificacionComponent,
    EditarTiposTurismoComponent,
    ListaAgenciasComponent,
    AgenciaDetalleComponent,
    ReconocimientosCrudComponent,
    SacionesCrudComponent,
    RechazosComponent,
  ],
})

export class AgenciaModule { }