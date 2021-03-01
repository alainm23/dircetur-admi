import { Component, OnInit, Input, TemplateRef} from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router'; 
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'ngx-aprobar-solicitud',
  templateUrl: './aprobar-solicitud.component.html',
  styleUrls: ['./aprobar-solicitud.component.scss']
})
export class AprobarSolicitudComponent implements OnInit {

@Input() public id_solicitud: string;
form: FormGroup;
subscribe_01: any;

  constructor(public database: DatabaseService, 
              public toastrService: NbToastrService,
              private router: Router,
              private dialogService: NbDialogService,
              public authService: AuthService,
              protected dialogRef: NbDialogRef<AprobarSolicitudComponent>) { }

  ngOnInit() {
    console.log('id de la solicitud=',this.id_solicitud);

    this.form = new FormGroup ({
      monto: new FormControl ('', [Validators.required]),
      observacion: new FormControl ('')
    });

  }


  submit () {
    let obj: any = {
      observacion:this.form.value.observacion,
      entregado_por:this.authService.usuario.nombre
    }
    let obj2: any = {
      fecha_entregado: new Date ().toISOString (),
      monto:this.form.value.monto,
      estado:2
    }
    

    this.database.addEntregaSolicitud(this.id_solicitud,obj,obj2).then (()=>{
      // Exito
      this.form.reset ();
      this.dialogRef.close();
    }).catch((e)=> {
      console.log('error al crear el detalle en la solicitud',e);
    });

  }

  cerrarForm () {
    this.dialogRef.close();
  }

}
