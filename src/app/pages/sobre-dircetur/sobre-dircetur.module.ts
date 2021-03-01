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
  NbPopoverModule,
  NbProgressBarModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { SobreDirceturRoutingModule } from './sobre-dircetur-routing.module';
import { SobreDirceturComponent } from './sobre-dircetur.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FuncionesComponent } from './funciones/funciones.component';
import { JuntaDirectivaComponent } from './junta-directiva/junta-directiva.component';

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
    SobreDirceturRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NbListModule,
    NbTabsetModule,
    NbPopoverModule,
    NbProgressBarModule
  ],
  declarations: [
    SobreDirceturComponent,
    FuncionesComponent,
    JuntaDirectivaComponent
  ],
})

export class SobreDirceturModule { }