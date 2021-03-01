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
import { GuiaRoutingModule } from './guia-routing.module';
import { GuiaComponent } from './guia.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgregarGuiaComponent } from './agregar-guia/agregar-guia.component';
import { EditarIdiomaComponent } from './editar-idioma/editar-idioma.component';
import { EditarAsociacionColegioComponent } from './editar-asociacion-colegio/editar-asociacion-colegio.component';
import { EditarCentroFormacionComponent } from './editar-centro-formacion/editar-centro-formacion.component';
import { EditarTiposGuiadoComponent } from './editar-tipos-guiado/editar-tipos-guiado.component';
import { ListaGuiasComponent } from './lista-guias/lista-guias.component';
import { GuiaDetalleComponent } from './guia-detalle/guia-detalle.component';

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
    GuiaRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    GuiaComponent,
    AgregarGuiaComponent,
    EditarIdiomaComponent,
    EditarAsociacionColegioComponent,
    EditarCentroFormacionComponent,
    EditarTiposGuiadoComponent,
    ListaGuiasComponent,
    GuiaDetalleComponent
  ],
})

export class GuiaModule { }
