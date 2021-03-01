import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudesComponent } from './solicitudes.component';
import { AgregarSolicitudComponent } from './agregar-solicitud/agregar-solicitud.component';
import { ListarSolicitanteComponent } from './listar-solicitante/listar-solicitante.component';
import { EditarSolicitanteComponent } from './editar-solicitante/editar-solicitante.component';
import { RegistrarSolicitudComponent } from './registrar-solicitud/registrar-solicitud.component';
import { ListarSolicitudesComponent } from './listar-solicitudes/listar-solicitudes.component';
import { AllSolicitudesComponent } from './all-solicitudes/all-solicitudes.component';
import { EditarSolicitudComponent } from './editar-solicitud/editar-solicitud.component';
import { RegistrarSolicitudv2Component } from './registrar-solicitudv2/registrar-solicitudv2.component';
import { ProcesarSolicitudesComponent } from './procesar-solicitudes/procesar-solicitudes.component';
import { ReporteGeneralComponent } from './reporte-general/reporte-general.component';

const routes: Routes = [{
  path: '',
  component: SolicitudesComponent,
  children: [
    {
      path: 'agregar-solicitante',
      component: AgregarSolicitudComponent,
    },
    {
      path: 'buscar-solicitante',
      component: ListarSolicitanteComponent,
    },
    {
      path: 'solicitante-detalle/:id',
      component: EditarSolicitanteComponent,
    },
    {
      path: 'registrar-solicitud/:id',
      component: RegistrarSolicitudComponent,
    },
    {
      path: 'listar-solicitudes/:idsolicitante',
      component: ListarSolicitudesComponent,
    },
    {
      path: 'filtrar-solicitudes',
      component: AllSolicitudesComponent,
    },
    {
      path: 'solicitud-detalle/:id',
      component: EditarSolicitudComponent,
    },
    {
      path: 'registrar-solicitudv2',
      component: RegistrarSolicitudv2Component,
    },
    {
      path: 'procesar-solicitudes',
      component: ProcesarSolicitudesComponent,
    },
    {
      path: 'reporte-general',
      component: ReporteGeneralComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SolicitudesRoutingModule {
}