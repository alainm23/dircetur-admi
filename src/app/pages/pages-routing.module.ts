import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './not-found/not-found.component';

// Components
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {
      path: 'agencia',
      loadChildren: () => import('./agencia/agencia.module')
        .then(m => m.AgenciaModule),
    },
    {
      path: 'alojamiento',
      loadChildren: () => import('./alojamiento/alojamiento.module')
        .then(m => m.AlojamientoModule),
    },
    {
      path: 'restaurante',
      loadChildren: () => import('./restaurante/restaurante.module')
        .then(m => m.RestauranteModule),
    },
    {
      path: 'guia',
      loadChildren: () => import('./guia/guia.module')
        .then(m => m.GuiaModule),      
    },
    {
      path: 'eventos',
      loadChildren: () => import('./eventos/eventos.module')
        .then(m => m.EventosModule),
    },
    {
      path: 'blog',
      loadChildren: () => import('./blog/blog.module')
        .then(m => m.BlogModule),     
    },
    {
      path: 'circuito-turistico',
      loadChildren: () => import('./circuito-turistico/circuito-turistico.module')
        .then(m => m.CircuitoTuristicoModule),
    },
    {
      path: 'viaje-programado',
      loadChildren: () => import('./viaje-programado/viaje-programado.module')
        .then(m => m.ViajeProgramadoModule),
    },
    {
      path: 'turismo-rural',
      loadChildren: () => import('./turismo-rural/turismo-rural.module')
        .then(m => m.TurismoRuralModule),      
    },
    {
      path: 'sobre-dircetur',
      loadChildren: () => import('./sobre-dircetur/sobre-dircetur.module')
        .then(m => m.SobreDirceturModule),        
    },
    {
      path: 'transparencia',
      loadChildren: () => import('./transparencia/transparencia.module')
        .then(m => m.TransparenciaModule), 
    },
    {
      path: 'FAQ',
      loadChildren: () => import('./FAQ/FAQ.module')
        .then(m => m.FAQModule),    
    },
    {
      path: 'boleto-turistico',
      loadChildren: () => import('./boleto-turistico/boleto-turistico.module')
        .then(m => m.BoletoTuristicoModule),    
    },
    {
      path: 'capacitaciones',
      loadChildren: () => import('./capacitaciones/capacitaciones.module')
        .then(m => m.CapacitacionesModule),    
    },
    {
      path: 'asuntos',
      loadChildren: () => import('./asuntos/asuntos.module')
        .then(m => m.AsuntosModule),    
    },
    {
      path: 'solicitudes',
      loadChildren: () => import('./solicitudes/solicitudes.module')
        .then(m => m.SolicitudesModule),    
    },
    {
      path: '**',
      component: NotFoundComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild (routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
