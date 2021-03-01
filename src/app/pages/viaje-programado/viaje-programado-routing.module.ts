import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajeProgramadoComponent } from './viaje-programado.component';
import { AgregarViajeProgramadoComponent } from './agregar-viaje-programado/agregar-viaje-programado.component';
import { ListarViajeProgramadoComponent } from './listar-viaje-programado/listar-viaje-programado.component';
import { ViajeProgramadoDetalleComponent } from './viaje-programado-detalle/viaje-programado-detalle.component';
import { EditarTiposComponent } from './editar-tipos/editar-tipos.component';
import { ViajeProgramadoPanelComponent } from './viaje-programado-panel/viaje-programado-panel.component';
import { PersonasComponent } from './personas/personas.component';

const routes: Routes = [{
  path: '',
  component: ViajeProgramadoComponent,
  children: [
    {
      path: 'agregar-viaje-programado',
      component: AgregarViajeProgramadoComponent,
    },
    {
      path: 'listar-viaje-programado',
      component: ListarViajeProgramadoComponent,
    },
    {
      path: 'viaje-programado-detalle/:id',
      component: ViajeProgramadoDetalleComponent,
    },
    {
      path: 'editar-tipos',
      component: EditarTiposComponent
    },
    {
      path: 'viaje-programado-panel',
      component: ViajeProgramadoPanelComponent
    },
    {
      path: 'personas',
      component: PersonasComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ViajeProgramadoRoutingModule {
}