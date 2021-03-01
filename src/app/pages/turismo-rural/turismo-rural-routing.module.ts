import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TurismoRuralComponent } from './turismo-rural.component';

import { AgregarTurismoRuralComponent } from './agregar-turismo-rural/agregar-turismo-rural.component';
import { TurismoRuralDetalleComponent } from './turismo-rural-detalle/turismo-rural-detalle.component';
import { ListarTurismoRuralComponent } from './listar-turismo-rural/listar-turismo-rural.component';

const routes: Routes = [{
  path: '',
  component: TurismoRuralComponent,
  children: [
    {
      path: 'agregar-turismo-rural',
      component: AgregarTurismoRuralComponent,
    },
    {
      path: 'turismo-rural-detalle/:id/:idioma',
      component: TurismoRuralDetalleComponent,
    },
    {
      path: 'listar-turismo-rural',
      component: ListarTurismoRuralComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class TurismoRuralRoutingModule {
}