import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsuntosComponent } from './asuntos.component';
import { AgregarAsuntoComponent } from './agregar-asunto/agregar-asunto.component';
import { ListarAsuntosComponent } from './listar-asuntos/listar-asuntos.component';
import { AsuntoDetalleComponent } from './asunto-detalle/asunto-detalle.component';

const routes: Routes = [{
  path: '',
  component: AsuntosComponent,
  children: [
    {
      path: 'agregar-asunto',
      component: AgregarAsuntoComponent,
    },
    {
      path: 'listar-asuntos',
      component: ListarAsuntosComponent,
    },
    {
      path: 'asunto-detalle/:id',
      component: AsuntoDetalleComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AsuntosRoutingModule {
}