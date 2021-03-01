import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router'; 
@Component({
  selector: 'ngx-listar-solicitudes',
  templateUrl: './listar-solicitudes.component.html',
  styleUrls: ['./listar-solicitudes.component.scss']
})
export class ListarSolicitudesComponent implements OnInit {
items: any [];
item_seleccionado: any;
subscribe_01: any;
id_solicitante: any;
estado_solicitud: string;
acum_montos_aprobados: number=0;
  constructor(public database: DatabaseService, 
              private route: ActivatedRoute,
              public toastrService: NbToastrService,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id_solicitante = params['idsolicitante'];
      console.log('Este es el id del solicitante=',this.id_solicitante);
      this.subscribe_01 = this.database.getSolicitudesBySolicitante (this.id_solicitante).subscribe ((response: any []) => {
        this.items = response;
        console.log ('Listado de solicitudes=',this.items);
        response.forEach(item => {
          console.log('detalle del foreach=',item);
          if (item.estado===1)
          {
            console.log('Entre en la condición HOLA');
            this.acum_montos_aprobados+=item.monto;
          }
        });
      });
      
    });
    
  }

  getData (item: any) {
    if (item.estado==0){
      this.estado_solicitud='Solicitado'; 
    } else if (item.estado==1){
      this.estado_solicitud='Aprobado';
    } else if (item.estado==2){
      this.estado_solicitud='Rechazado';
    }
    return 'Apellido: ' + item.apellido + ' - ' + 'Número de Documento: ' + item.n_doc + ' - ' + 'Tipo de Capacitación: ' + item.capacitacion.nombre + ' - ' + /*'Asunto: ' + item.asunto.nombre + ' - ' +*/ 'Monto: ' + item.monto + ' - ' + 'Fecha de Solicitud: ' + item.fecha_solicitud + /*' - ' + 'Fecha de Cambio de Estado: ' + item.fecha_cambio + ' - ' +*/ 'Estado: ' + this.estado_solicitud;
  }

  verDetalle (item: any) {
    this.item_seleccionado = item;
    this.router.navigate(['/pages/solicitudes/solicitud-detalle/',this.item_seleccionado.id]);
  }

  estado (item: any, estado: number) {
    this.acum_montos_aprobados=0;
    
    this.database.updateEstadoSolicitud (item, estado)
    .then (() => {
      this.showToast ('top-right');
    }).catch ((error: any) => {
      console.log ("Error", error);
    });

    this.items.forEach(item => {
      console.log('detalle del foreach=',item);
      if (item.estado===1)
      {
        console.log('Entre en la condición HOLA');
        this.acum_montos_aprobados+=item.monto;
      }
    });

  }

  showToast (position) {
    this.toastrService.show(
      '',
      'Estado cambiado con éxito.',
      { position });
  }

  ngOnDestroy () {
    if (this.subscribe_01 !== null && this.subscribe_01 !== undefined) {
      this.subscribe_01.unsubscribe ();
    }
  }
}
