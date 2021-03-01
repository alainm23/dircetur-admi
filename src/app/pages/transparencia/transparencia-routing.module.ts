import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransparenciaComponent } from './transparencia.component';

import { EditarCategoriasComponent } from './editar-categorias/editar-categorias.component';
import { AgregarItemComponent } from './agregar-item/agregar-item.component';

const routes: Routes = [{
  path: '',
  component: TransparenciaComponent,
  children: [
    {
      path: 'editar-categorias',
      component: EditarCategoriasComponent,
    },
    {
      path: 'agregar-item',
      component: AgregarItemComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class TransparenciaRoutingModule {
}