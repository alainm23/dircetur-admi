import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SobreDirceturComponent } from './sobre-dircetur.component';
import { FuncionesComponent } from './funciones/funciones.component';
import { JuntaDirectivaComponent } from './junta-directiva/junta-directiva.component';

const routes: Routes = [{
  path: '',
  component: SobreDirceturComponent,
  children: [
    {
      path: 'funciones',
      component: FuncionesComponent,
    },
    {
      path: 'junta-directiva',
      component: JuntaDirectivaComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SobreDirceturRoutingModule {
}