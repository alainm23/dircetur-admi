import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestauranteComponent } from './restaurante.component';
import { AgregarRestauranteComponent } from './agregar-restaurante/agregar-restaurante.component';
import { EditarClasificacionComponent } from './editar-clasificacion/editar-clasificacion.component';
import { EditarCategoriaComponent } from './editar-categoria/editar-categoria.component';
import { RestauranteDetalleComponent } from './restaurante-detalle/restaurante-detalle.component';
import { ListaRestaurantesComponent } from './lista-restaurantes/lista-restaurantes.component';

const routes: Routes = [{
  path: '',
  component: RestauranteComponent,
  children: [
    {
      path: 'agregar-restaurante',
      component: AgregarRestauranteComponent,
    },
    {
      path: 'editar-clasificacion',
      component: EditarClasificacionComponent,
    },
    {
      path: 'editar-categoria',
      component: EditarCategoriaComponent,
    },
    {
      path: 'restaurante-detalle/:id',
      component: RestauranteDetalleComponent,
    },
    {
      path: 'lista-restaurantes',
      component: ListaRestaurantesComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class RestauranteRoutingModule {
}