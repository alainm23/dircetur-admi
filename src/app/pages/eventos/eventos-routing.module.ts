import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventosComponent } from './eventos.component';
import { AgregarEventosComponent } from './agregar-eventos/agregar-eventos.component';
import { VerEventosComponent } from './ver-eventos/ver-eventos.component';
import { EditarTiposComponent } from "./editar-tipos/editar-tipos.component";
import { EventoDetalleComponent } from "./evento-detalle/evento-detalle.component";

const routes: Routes = [{
  path: '',
  component: EventosComponent,
  children: [
    {
      path: 'agregar-eventos',
      component: AgregarEventosComponent,
    },
    {
      path: 'ver-eventos',
      component: VerEventosComponent,
    },
    {
      path: 'editar-tipos',
      component: EditarTiposComponent,
    },
    {
      path: 'evento-detalle/:id/:idioma',
      component: EventoDetalleComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class EventosRoutingModule {
}