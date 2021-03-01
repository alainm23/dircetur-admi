import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoletoTuristicoComponent } from './boleto-turistico.component';
import { AgregarBoletoTuristicoComponent } from './agregar-boleto-turistico/agregar-boleto-turistico.component';
import { AgregarMuseoComponent } from './agregar-museo/agregar-museo.component';
import { AgregarParquesArqueologicoComponent } from './agregar-parques-arqueologico/agregar-parques-arqueologico.component';

const routes: Routes = [{
  path: '',
  component: BoletoTuristicoComponent,
  children: [
    {
      path: 'agregar-boleto',
      component: AgregarBoletoTuristicoComponent,
    },
    {
      path: 'agregar-museo',
      component: AgregarMuseoComponent,
    },
    {
      path: 'agregar-parques-arqueologico',
      component: AgregarParquesArqueologicoComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class BoletoTuristicoRoutingModule {
}