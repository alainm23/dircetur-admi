import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CircuitoTuristicoComponent } from './circuito-turistico.component';
import { AgregarCircuitoTuristicoComponent } from './agregar-circuito-turistico/agregar-circuito-turistico.component';
import { ListarCircuitosComponent } from './listar-circuitos/listar-circuitos.component';
import { CircuitoDetalleComponent } from './circuito-detalle/circuito-detalle.component';

const routes: Routes = [{
  path: '',
  component: CircuitoTuristicoComponent,
  children: [
    {
      path: 'agregar-circuito-turistico',
      component: AgregarCircuitoTuristicoComponent,
    },
    {
      path: 'listar-circuitos',
      component: ListarCircuitosComponent,
    },
    {
      path: 'circuito-detalle/:id/:idioma',
      component: CircuitoDetalleComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CircuitoTuristicoRoutingModule {
}