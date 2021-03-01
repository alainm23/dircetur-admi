import { Component, OnInit, Input} from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { NbToastrService, NbDialogRef } from '@nebular/theme';
import * as moment from 'moment';
@Component({
  selector: 'ngx-ver-detalle-solicitud',
  templateUrl: './ver-detalle-solicitud.component.html',
  styleUrls: ['./ver-detalle-solicitud.component.scss']
})
export class VerDetalleSolicitudComponent implements OnInit {
@Input() public id: string;
subscribe_01: any;
subscribe_02: any;
subscribe_03: any;
solicitante: any;
estado_solicitud: string;
detalle: any;
estado_natural: boolean = false;
estado_juridico: boolean = false;
informacion_detalle: any;
estado_capacitacion: boolean = false;
is_loading: boolean = true;
  constructor(public database: DatabaseService,
              public toastrService: NbToastrService,
              protected dialogRef: NbDialogRef<VerDetalleSolicitudComponent>) { }

  ngOnInit() {
    console.log('Este es el id de la solicitud=',this.id);
      this.subscribe_01=this.database.getSolicitudById (this.id).subscribe ((d: any) => {

        this.detalle=d;
        console.log('Información de la solicitud=',this.detalle);
        if(this.detalle.tipo=="Natural")
        {
          this.estado_juridico=false;
          this.estado_natural=true;
        }
        else
        {
          this.estado_natural=false;
          this.estado_juridico=true;
        }

        this.subscribe_03=this.database.getContactoByIdSolicitud (this.id).subscribe ((resp2: any) => {
          console.log('Información del Detalle=',resp2);
          this.informacion_detalle=resp2;
        });

        if (this.detalle.estado==0)
        {
          this.estado_solicitud='Solicitado'; 
        } 
        else if (this.detalle.estado==1)
        {
          this.estado_solicitud='Aprobado';
        } 
        else if (this.detalle.estado==2)
        {
          this.estado_solicitud='Entregado';
        }
        else if (this.detalle.estado==3)
        {
          this.estado_solicitud='Rechazado';
        }

        if(this.detalle.capacitacion!=null || this.detalle.capacitacion!=undefined)
        {
          this.estado_capacitacion=true;
        }
        
        this.subscribe_02=this.database.getSolicitanteById (String(this.detalle.id_solicitante)).subscribe ((beneficiario: any) => {
          this.solicitante=beneficiario;
          console.log('Información del Solicitante=',this.solicitante);
          
        });
        this.is_loading=false;
      }, err => {
        console.log('ERRRORRRR=',err);
      });
  }
  close () {
    this.dialogRef.close();
  }
  formatFecha (fecha:any) {
    return moment(fecha).format('DD MMMM YYYY, h:mm:ss a');
  }
  
}
