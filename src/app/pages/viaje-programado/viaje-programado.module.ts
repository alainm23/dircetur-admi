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
  NbProgressBarModule,
  NbDialogModule,
  NbTooltipModule,
  NbAccordionModule,
  NbToggleModule,
  NbPopoverModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ViajeProgramadoComponent } from './viaje-programado.component';
import { ViajeProgramadoRoutingModule } from './viaje-programado-routing.module';

import { AgregarViajeProgramadoComponent } from './agregar-viaje-programado/agregar-viaje-programado.component';
import { ListarViajeProgramadoComponent } from './listar-viaje-programado/listar-viaje-programado.component';
import { ViajeProgramadoDetalleComponent } from './viaje-programado-detalle/viaje-programado-detalle.component';
import { EditarTiposComponent } from './editar-tipos/editar-tipos.component';
import { ViajeProgramadoPanelComponent } from './viaje-programado-panel/viaje-programado-panel.component';

// Order Pipe
import { OrderModule } from 'ngx-order-pipe';
import { PersonasComponent } from './personas/personas.component';

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
    ViajeProgramadoRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    NbCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    NbProgressBarModule,
    NbDialogModule.forRoot(),
    NbTooltipModule,
    OrderModule,
    NbAccordionModule,
    NbToggleModule,
    NbPopoverModule
  ],
  declarations: [
    ViajeProgramadoComponent,
    AgregarViajeProgramadoComponent,
    ListarViajeProgramadoComponent,
    ViajeProgramadoDetalleComponent,
    EditarTiposComponent,
    ViajeProgramadoPanelComponent,
    PersonasComponent,
  ],
})

export class ViajeProgramadoModule { }
