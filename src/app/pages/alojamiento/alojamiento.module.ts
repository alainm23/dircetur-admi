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
  NbAlertModule, 
  NbDialogModule,
  NbTooltipModule,
  NbPopoverModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { AlojamientoRoutingModule } from './alojamiento-routing.module';
import { AlojamientoComponent } from './alojamiento.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgregarHotelComponent } from './agregar-hotel/agregar-hotel.component';
import { EditarClasificacionComponent } from './editar-clasificacion/editar-clasificacion.component';
import { ListaAlojamientosComponent } from './lista-alojamientos/lista-alojamientos.component';
import { AlojamientoDetalleComponent } from './alojamiento-detalle/alojamiento-detalle.component';

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
    AlojamientoRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NbListModule,
    NbAlertModule,
    NbDialogModule,
    NbTooltipModule,
    NbPopoverModule
  ],
  declarations: [
    AlojamientoComponent,
    AgregarHotelComponent,
    EditarClasificacionComponent,
    ListaAlojamientosComponent,
    AlojamientoDetalleComponent
  ],
})

export class AlojamientoModule { }