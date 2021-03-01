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
  NbListModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { RestauranteRoutingModule } from './restaurante-routing.module';
import { RestauranteComponent } from './restaurante.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgregarRestauranteComponent } from './agregar-restaurante/agregar-restaurante.component';
import { EditarClasificacionComponent } from './editar-clasificacion/editar-clasificacion.component';
import { EditarCategoriaComponent } from './editar-categoria/editar-categoria.component';
import { ListaRestaurantesComponent } from './lista-restaurantes/lista-restaurantes.component';
import { RestauranteDetalleComponent } from './restaurante-detalle/restaurante-detalle.component';

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
    RestauranteRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    RestauranteComponent,
    AgregarRestauranteComponent,
    EditarClasificacionComponent,
    EditarCategoriaComponent,
    ListaRestaurantesComponent,
    RestauranteDetalleComponent
  ],
})

export class RestauranteModule { }