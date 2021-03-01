import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';
@Component({
  selector: 'ngx-editar-solicitud',
  templateUrl: './editar-solicitud.component.html',
  styleUrls: ['./editar-solicitud.component.scss']
})
export class EditarSolicitudComponent implements OnInit {
form: FormGroup;
id: string;
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
  constructor(public database: DatabaseService,
              private route: ActivatedRoute,
              public toastrService: NbToastrService) { }

  ngOnInit() {
    this.form = new FormGroup ({
      tipo: new FormControl ('', [Validators.required]),
      nombre_completo: new FormControl ('', [Validators.required]),
      n_doc: new FormControl ('', [Validators.required]),
      razon_social: new FormControl (''),
      nombre_comercial: new FormControl (''),
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      capacitacion: new FormControl ('', Validators.required),
      asunto: new FormControl ('', Validators.required),
      estado: new FormControl ('', Validators.required)
    });
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log('Este es el id=',this.id);
      this.subscribe_01=this.database.getSolicitudById (this.id).subscribe ((d: any) => {
        this.form.patchValue (d);
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
        
        
        this.form.controls['provincia'].setValue(this.detalle.provincia.nombre);
        this.form.controls['distrito'].setValue(this.detalle.distrito.nombre);

        if(this.detalle.asunto!=null || this.detalle.asunto!=undefined)
        {
          this.form.controls['asunto'].setValue(this.detalle.asunto.nombre);
        }

        if(this.detalle.capacitacion!=null || this.detalle.capacitacion!=undefined)
        {
          this.estado_capacitacion=true;
          this.form.controls['capacitacion'].setValue(this.detalle.capacitacion.nombre);
        }
        
        this.subscribe_02=this.database.getSolicitanteById (String(this.detalle.id_solicitante)).subscribe ((beneficiario: any) => {
          console.log('Información del Solicitante=',beneficiario);
          this.solicitante=beneficiario;
        });
        
      });
    });
  }
  ngOnDestroy () {
    if (this.subscribe_01 !== null && this.subscribe_01 !== undefined) {
      this.subscribe_01.unsubscribe ();
    }
    if (this.subscribe_02 !== null && this.subscribe_02 !== undefined) {
      this.subscribe_02.unsubscribe ();
    }
    if (this.subscribe_03 !== null && this.subscribe_03 !== undefined) {
      this.subscribe_03.unsubscribe ();
    }
  }
}
