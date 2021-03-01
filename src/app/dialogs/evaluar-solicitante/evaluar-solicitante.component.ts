import { Component, OnInit, Input, TemplateRef} from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router'; 
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import * as moment from 'moment';
@Component({
  selector: 'ngx-evaluar-solicitante',
  templateUrl: './evaluar-solicitante.component.html',
  styleUrls: ['./evaluar-solicitante.component.scss']
})
export class EvaluarSolicitanteComponent implements OnInit {

@Input() public id_solicitante: string;
@Input() public id_solicitud: string;

beneficiario: any;
solicitud: any;
solicitud_detalle: any;
solicitudes: any [];
subscribe_01: any;
subscribe_02: any;
subscribe_03: any;
subscribe_04: any;
item_seleccionado: any;
mostrar_capacitacion: boolean = false;
estados_solicitudes: any [] = [
  {
    value: 0,
    nombre: 'Solicitado',
  },
  {
    value: 1,
    nombre: 'Aprobado',
  },
  {
    value: 2,
    nombre: 'Entregado',
  },
  {
    value: 3,
    nombre: 'Rechazado',
  }
];
  constructor(public database: DatabaseService, 
              public toastrService: NbToastrService,
              private router: Router,
              private dialogService: NbDialogService,
              protected dialogRef: NbDialogRef<EvaluarSolicitanteComponent>) { }

  ngOnInit() {
    console.log('id del solicitante=',this.id_solicitante);

    this.subscribe_01 = this.database.getSolicitanteById (this.id_solicitante).subscribe ((data: any []) => {
      this.beneficiario = data;
      console.log('Informacion del Beneficiario',this.beneficiario);
    
    });

    this.subscribe_02 = this.database.getSolicitudById (this.id_solicitud).subscribe ((info: any []) => {
      this.solicitud = info;
      console.log('Informacion de la Solicitud',this.solicitud);

        if (this.solicitud.tipo=="Natural")
        {
          this.solicitud.nombre=this.solicitud.nombre_completo;
        }
        else
        {
          this.solicitud.nombre=this.solicitud.nombre_comercial;
        }
      
        if (this.solicitud.capacitacion!=null || this.solicitud.capacitacion!=undefined)
        {
          this.mostrar_capacitacion=true;
        }

      this.estados_solicitudes.forEach(estado => {
        if (this.solicitud.estado==estado.value)
        {
          this.solicitud.estadonombre=estado.nombre;
        }
      });
  
    });

    // Obtener Detalle de la solitud
    this.subscribe_04 = this.database.getContactoByIdSolicitud (this.id_solicitud).subscribe ((detalle: any []) => {
      this.solicitud_detalle = detalle;
      console.log('Detalle de la solicitud:',this.solicitud_detalle);
    });

    // All solicitudes
    this.subscribe_03 = this.database.getSolicitudesByIdSolicitante (this.id_solicitante).subscribe ((response: any []) => {
      this.solicitudes = response;
      console.log('Todas las solicitudes',this.solicitudes);
      this.solicitudes.forEach(solicitud => {
        if (solicitud.tipo=="Natural")
        {
          solicitud.nombre=solicitud.nombre_completo;
        }
        else
        {
          solicitud.nombre=solicitud.nombre_comercial;
        }
        this.estados_solicitudes.forEach(estado => {
          if (solicitud.estado==estado.value)
          {
            solicitud.estadonombre=estado.nombre;
          }
        });
      });
    });

  }

  formatFecha (fecha:any) {
    return moment(fecha).format('LL');
  }

  changeEstado (estado:number) {
    if (estado==1)
    {
      this.database.updateEstadoSolicitud (this.solicitud, estado)
      .then (() => {
        this.showToast ('top-right');
      }).catch ((error: any) => {
        console.log ("Error", error);
      });
      this.dialogRef.close();
    }
    
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'Estado cambiado con éxito.',
      { position });
  }

  gOnDestroy () {
    if (this.subscribe_01 !== null && this.subscribe_01 !== undefined) {
      this.subscribe_01.unsubscribe ();
    }

    if (this.subscribe_02 !== null && this.subscribe_02 !== undefined) {
      this.subscribe_02.unsubscribe ();
    }
    
    if (this.subscribe_03 !== null && this.subscribe_03 !== undefined) {
      this.subscribe_03.unsubscribe ();
    }

    if (this.subscribe_04 !== null && this.subscribe_04 !== undefined) {
      this.subscribe_04.unsubscribe ();
    }

  }

}
