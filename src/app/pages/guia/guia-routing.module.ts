import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuiaComponent } from './guia.component';
import { AgregarGuiaComponent } from './agregar-guia/agregar-guia.component';
import { EditarIdiomaComponent } from './editar-idioma/editar-idioma.component';
import { EditarAsociacionColegioComponent } from './editar-asociacion-colegio/editar-asociacion-colegio.component';
import { EditarCentroFormacionComponent } from './editar-centro-formacion/editar-centro-formacion.component';
import { EditarTiposGuiadoComponent } from './editar-tipos-guiado/editar-tipos-guiado.component';
import { ListaGuiasComponent } from './lista-guias/lista-guias.component';
import { GuiaDetalleComponent } from './guia-detalle/guia-detalle.component';
const routes: Routes = [{
  path: '',
  component: GuiaComponent,
  children: [
    {
      path: 'lista-guias',
      component: ListaGuiasComponent,
    },
    {
        path: 'agregar-guia',
        component: AgregarGuiaComponent,
    },
    {
        path: 'editar-idioma',
        component: EditarIdiomaComponent,
    }, 
    {
        path: 'editar-asociacion-colegio',
        component: EditarAsociacionColegioComponent,
    },
    {
        path: 'editar-centro-formacion',
        component: EditarCentroFormacionComponent,
    },
    {
      path: 'editar-tipos-guiado',
      component: EditarTiposGuiadoComponent,
    },
    {
      path: 'guia-detalle/:id',
      component: GuiaDetalleComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class GuiaRoutingModule {
}