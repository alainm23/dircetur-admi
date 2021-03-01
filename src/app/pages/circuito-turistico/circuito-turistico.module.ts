import { NgModule } from '@angular/core';

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
  NbTabsetModule,
  NbProgressBarModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { CircuitoTuristicoRoutingModule } from './circuito-turistico-routing.module';
import { CircuitoTuristicoComponent } from './circuito-turistico.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgregarCircuitoTuristicoComponent } from './agregar-circuito-turistico/agregar-circuito-turistico.component';
import { ListarCircuitosComponent } from './listar-circuitos/listar-circuitos.component';
import { CircuitoDetalleComponent } from './circuito-detalle/circuito-detalle.component';

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
    CircuitoTuristicoRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NbListModule,
    NbTabsetModule,
    NbProgressBarModule
  ],
  declarations: [
    CircuitoTuristicoComponent,
    AgregarCircuitoTuristicoComponent,
    ListarCircuitosComponent,
    CircuitoDetalleComponent
  ],
})

export class CircuitoTuristicoModule { }