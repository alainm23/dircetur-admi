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
import { TransparenciaRoutingModule } from './transparencia-routing.module';
import { TransparenciaComponent } from './transparencia.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditarCategoriasComponent } from './editar-categorias/editar-categorias.component';
import { AgregarItemComponent } from './agregar-item/agregar-item.component';

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
    TransparenciaRoutingModule,
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
    TransparenciaComponent,
    EditarCategoriasComponent,
    AgregarItemComponent
  ],
})

export class TransparenciaModule { }