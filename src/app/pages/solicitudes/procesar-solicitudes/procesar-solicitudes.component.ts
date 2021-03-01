import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { VerSolicitudComponent } from '../../../dialogs/ver-solicitud/ver-solicitud.component';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'ngx-procesar-solicitudes',
  templateUrl: './procesar-solicitudes.component.html',
  styleUrls: ['./procesar-solicitudes.component.scss']
})
export class ProcesarSolicitudesComponent implements OnInit {
solicitudes: any [];
subscribe_01: any;
item_seleccionado: any;
form_apro: FormGroup;
form_rechazar: FormGroup;
subscribe_01_apro: any;
estado_view: string = "listado";
idAprobar: string;
idEvaluar: string;
idSolicitanteEvaluar: string;
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



beneficiario: any;
solicitud: any;
solicitud_detalle: any;
solicitudes_evaluar: any [];
subscribe_01_evaluar: any;
subscribe_02_evaluar: any;
subscribe_03_evaluar: any;
subscribe_04_evaluar: any;
item_seleccionado_evaluar: any;
mostrar_capacitacion: boolean = false;
is_loading: boolean = true;

  constructor(public database: DatabaseService, 
              public toastrService: NbToastrService,
              public authService: AuthService,
              private dialogService: NbDialogService) { }

  ngOnInit() {
    this.form_apro = new FormGroup ({
      monto: new FormControl ('', [Validators.required]),
      observacion: new FormControl ('')
    });

    this.form_rechazar = new FormGroup ({
      observacion_rechazo: new FormControl ('', [Validators.required])
    });

    this.subscribe_01 = this.database.getProcesarSolicitudes ().subscribe ((response: any []) => {
      this.solicitudes = response;
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
      this.is_loading=false;
    });

    if (this.subscribe_01==undefined || this.subscribe_01==null)
    {
      this.is_loading=false;
    }
  }


  submitAprobar (id:string) {
    this.is_loading=true;
    let obj: any = {
      observacion:this.form_apro.value.observacion,
      entregado_por:this.authService.usuario.nombre
    }
    let obj2: any = {
      fecha_entregado: new Date ().toISOString (),
      monto:this.form_apro.value.monto,
      estado:2
    }
    

    this.database.addEntregaSolicitud(id,obj,obj2).then (()=>{
      // listado
      this.estado_view = "listado";
      // Exito
      this.form_apro.reset ();
      this.is_loading=false;

    }).catch((e)=> {
      console.log('error al crear el detalle en la solicitud',e);
    });

    
  }

  cerrarAprobar () {
    this.form_apro.reset();
    this.estado_view="listado";
  }

  formatFecha (fecha:any) {
    return moment(fecha).format('DD MMMM YYYY, h:mm:ss a');
  }

  evaluarSolicitud (data:any) {
    this.is_loading=true;
    /*this.dialogService.open (EvaluarSolicitanteComponent, {
      context: {
        id_solicitud: data.id,
        id_solicitante: data.id_solicitante,
      }
    });*/
   
    this.estado_view="evaluar";
    this.idEvaluar=data.id;
    this.idSolicitanteEvaluar=data.id_solicitante;
    

    console.log('id del solicitante=',this.idSolicitanteEvaluar);

    this.subscribe_01_evaluar = this.database.getSolicitanteById (this.idSolicitanteEvaluar).subscribe ((data: any []) => {
      this.beneficiario = data;
      console.log('Informacion del Beneficiario',this.beneficiario);
    
    });

    this.subscribe_02_evaluar = this.database.getSolicitudById (this.idEvaluar).subscribe ((info: any []) => {
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
    this.subscribe_04_evaluar = this.database.getContactoByIdSolicitud (this.idEvaluar).subscribe ((detalle: any []) => {
      this.solicitud_detalle = detalle;
      console.log('Detalle de la solicitud:',this.solicitud_detalle);
    });

    // All solicitudes
    this.subscribe_03_evaluar = this.database.getSolicitudesByIdSolicitante (this.idSolicitanteEvaluar).subscribe ((response: any []) => {
      this.solicitudes_evaluar = response;
      console.log('Todas las solicitudes',this.solicitudes_evaluar);
      this.solicitudes_evaluar.forEach(solicitud => {
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
    this.is_loading=false;
  }
  
  changeEstado (estado:number) {
    this.is_loading=true;
    if (estado==1)
    {
      this.database.updateEstadoSolicitud (this.solicitud, estado)
      .then (() => {
        this.is_loading=false;
        this.showToast ('top-right');
        this.estado_view="listado";
      }).catch ((error: any) => {
        console.log ("Error", error);
      });
     
    } else if (estado==3) 
    {
      this.is_loading=false;
      this.estado_view="rechazarSolicitud";
    }
    
  }
  
  submitRechazo () {
    this.is_loading=true;
    let obj: any ={
      estado:3,
      observacion_rechazo:this.form_rechazar.value.observacion_rechazo
    };
    this.database.updateEstadoSolicitudRechazado (this.solicitud, obj)
    .then (() => {
      this.is_loading=false;
      this.showToast ('top-right');
      // listado
      this.estado_view = "listado";
    }).catch ((error: any) => {
      console.log ("Error", error);
    });

    
  }
  

  showToast (position) {
    this.toastrService.show(
      '',
      'Estado cambiado con éxito.',
      { position });
  }

  entregarSolicitud (data:any) {
    this.is_loading=true;
   /* this.dialogService.open (AprobarSolicitudComponent, {
      context: {
        id_solicitud: data.id,
      }
    });*/
    this.estado_view="entregar";
    this.idAprobar=data.id;
    this.is_loading=false;
  }

  detalleSolicitud (item:any) {
    this.item_seleccionado = item;

    this.dialogService.open (VerSolicitudComponent, {
      context: {
        id: this.item_seleccionado.id,
      }
    });

  }

  ngOnDestroy () {
    if (this.subscribe_01 !== null && this.subscribe_01 !== undefined) {
      this.subscribe_01.unsubscribe ();
    }

    if (this.subscribe_01_apro !== null && this.subscribe_01_apro !== undefined) {
      this.subscribe_01_apro.unsubscribe ();
    }

    if (this.subscribe_01_evaluar !== null && this.subscribe_01_evaluar !== undefined) {
      this.subscribe_01_evaluar.unsubscribe ();
    }

    if (this.subscribe_02_evaluar !== null && this.subscribe_02_evaluar !== undefined) {
      this.subscribe_02_evaluar.unsubscribe ();
    }

    if (this.subscribe_03_evaluar !== null && this.subscribe_03_evaluar !== undefined) {
      this.subscribe_03_evaluar.unsubscribe ();
    }

    if (this.subscribe_04_evaluar !== null && this.subscribe_04_evaluar !== undefined) {
      this.subscribe_04_evaluar.unsubscribe ();
    }

  }
  

}
