import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapacitacionesComponent } from './capacitaciones.component';
import { AgregarCapaComponent } from './agregar-capa/agregar-capa.component';
import { ListarCapasComponent } from './listar-capas/listar-capas.component';
import { CapaDetalleComponent } from './capa-detalle/capa-detalle.component';

const routes: Routes = [{
  path: '',
  component: CapacitacionesComponent,
  children: [
    {
      path: 'agregar-capa',
      component: AgregarCapaComponent,
    },
    {
      path: 'listar-capas',
      component: ListarCapasComponent,
    },
    {
      path: 'capa-detalle/:id',
      component: CapaDetalleComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CapacitacionesRoutingModule {
}