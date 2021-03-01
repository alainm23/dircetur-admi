import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgenciaComponent } from './agencia.component';
import { AgregarAgenciaComponent } from './agregar-agencia/agregar-agencia.component';
import { EditarClasificacionComponent } from './editar-clasificacion/editar-clasificacion.component';
import { EditarTiposTurismoComponent } from './editar-tipos-turismo/editar-tipos-turismo.component';
import { ListaAgenciasComponent } from "./lista-agencias/lista-agencias.component";
import { AgenciaDetalleComponent } from "./agencia-detalle/agencia-detalle.component";
import { ReconocimientosCrudComponent } from './reconocimientos-crud/reconocimientos-crud.component';
import { SacionesCrudComponent } from './saciones-crud/saciones-crud.component';
import { RechazosComponent } from './rechazos/rechazos.component';

const routes: Routes = [{
  path: '',
  component: AgenciaComponent,
  children: [
    {
      path: 'lista-agencias',
      component: ListaAgenciasComponent,
    },
    {
      path: 'agregar-agencia',
      component: AgregarAgenciaComponent,
    },
    {
      path: 'editar-clasificacion',
      component: EditarClasificacionComponent,
    },
    {
      path: 'editar-tipos-turismo',
      component: EditarTiposTurismoComponent,
    }, 
    {
      path: 'agencia-detalle/:id',
      component: AgenciaDetalleComponent,
    },
    {
      path: 'reconocimientos-crud',
      component: ReconocimientosCrudComponent,
    },
    {
      path: 'saciones-crud',
      component: SacionesCrudComponent,
    },
    {
      path: 'rechazos/:tipo',
      component: RechazosComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AgenciaRoutingModule {
}