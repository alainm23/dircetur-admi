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
import { TurismoRuralRoutingModule } from './turismo-rural-routing.module';
import { TurismoRuralComponent } from './turismo-rural.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgregarTurismoRuralComponent } from './agregar-turismo-rural/agregar-turismo-rural.component';
import { TurismoRuralDetalleComponent } from './turismo-rural-detalle/turismo-rural-detalle.component';
import { ListarTurismoRuralComponent } from './listar-turismo-rural/listar-turismo-rural.component';

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
    TurismoRuralRoutingModule,
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
    TurismoRuralComponent,
    AgregarTurismoRuralComponent,
    TurismoRuralDetalleComponent,
    ListarTurismoRuralComponent
  ],
})

export class TurismoRuralModule { }