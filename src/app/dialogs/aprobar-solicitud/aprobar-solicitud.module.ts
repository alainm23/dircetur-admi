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
    NbDialogModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AprobarSolicitudComponent } from './aprobar-solicitud.component';


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
    NbDialogModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AprobarSolicitudComponent,
  ],
})
export class AprobarSolicitudModule { }