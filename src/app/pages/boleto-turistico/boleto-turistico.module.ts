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
  NbCalendarModule,
  NbProgressBarModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BoletoTuristicoComponent } from './boleto-turistico.component';
import { BoletoTuristicoRoutingModule } from './boleto-turistico-routing.module';

import { AgregarBoletoTuristicoComponent } from "./agregar-boleto-turistico/agregar-boleto-turistico.component";


// Editor
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AgregarParquesArqueologicoComponent } from './agregar-parques-arqueologico/agregar-parques-arqueologico.component';
import { AgregarMuseoComponent } from './agregar-museo/agregar-museo.component';


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
    BoletoTuristicoRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    NbCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    NbProgressBarModule,
    CKEditorModule
  ],
  declarations: [
    BoletoTuristicoComponent,
    AgregarBoletoTuristicoComponent,
    AgregarParquesArqueologicoComponent,
    AgregarMuseoComponent
  ],
})

export class BoletoTuristicoModule { }
