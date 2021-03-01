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
    NbToggleModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ViajeProgramadoPersonasComponent } from './viaje-programado-personas.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NbSpinnerModule,
    NbListModule,
    FormsModule,
    ReactiveFormsModule,
    NbToggleModule
  ],
  declarations: [
    ViajeProgramadoPersonasComponent,
  ],
})
export class ViajeProgramadoPersonasModule { }