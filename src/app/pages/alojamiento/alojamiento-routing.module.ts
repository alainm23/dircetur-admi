import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlojamientoComponent } from './alojamiento.component';
import { AgregarHotelComponent } from './agregar-hotel/agregar-hotel.component';
import { EditarClasificacionComponent } from './editar-clasificacion/editar-clasificacion.component';
import { ListaAlojamientosComponent } from './lista-alojamientos/lista-alojamientos.component';
import { AlojamientoDetalleComponent } from './alojamiento-detalle/alojamiento-detalle.component';
const routes: Routes = [{
  path: '',
  component: AlojamientoComponent,
  children: [
    {
      path: 'agregar-hotel',
      component: AgregarHotelComponent,
    },
    {
      path: 'lista-alojamientos',
      component: ListaAlojamientosComponent,
    },
    {
      path: 'alojamiento-detalle/:id',
      component: AlojamientoDetalleComponent,
    },
    {
      path: 'editar-clasificacion',
      component: EditarClasificacionComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AlojamientoRoutingModule {
}