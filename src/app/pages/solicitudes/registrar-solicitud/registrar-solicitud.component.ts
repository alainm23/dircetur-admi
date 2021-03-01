import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'ngx-registrar-solicitud',
  templateUrl: './registrar-solicitud.component.html',
  styleUrls: ['./registrar-solicitud.component.scss']
})
export class RegistrarSolicitudComponent implements OnInit {
form: FormGroup;
id_solicitante: string;
capacitaciones: any [];
asuntos: any [];
subscribe_01: any;
subscribe_02: any;
  constructor(
    public database: DatabaseService,
    private route: ActivatedRoute,
    public toastrService: NbToastrService,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.form = new FormGroup ({
      nombre: new FormControl ('', [Validators.required]),
      apellido: new FormControl ('', [Validators.required]),
      n_doc: new FormControl ('', [Validators.required]),
      razon_social: new FormControl (''),
      nombre_comercial: new FormControl (''),
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      capacitacion: new FormControl ('', Validators.required),
      asunto: new FormControl ('', Validators.required),
      descripcion: new FormControl ('', Validators.required),
      monto: new FormControl ('', Validators.required)
    });
    this.route.params.subscribe(params => {
      this.id_solicitante = params['id'];
      console.log('Este es el id del solicitante=',this.id_solicitante);
      this.database.getSolicitanteById (this.id_solicitante).subscribe ((d: any) => {
        console.log('Detalle del solicitante=',d);
        this.form.patchValue (d);
        this.subscribe_01 = this.database.getCapacitaciones ().subscribe ((response: any []) => {
          this.capacitaciones = response;
        });
        this.subscribe_02 = this.database.getAsuntos ().subscribe ((response: any []) => {
          this.asuntos = response;
        });
      });
    });
  }

  submit () {
    let obj: any = {
      id:this.afs.createId (),
      id_solicitante:this.id_solicitante,
      nombre:this.form.value.nombre,
      apellido:this.form.value.apellido,
      n_doc:this.form.value.n_doc,
      razon_social:this.form.value.razon_social,
      nombre_comercial:this.form.value.nombre_comercial,
      provincia:this.form.value.provincia,
      distrito:this.form.value.distrito,
      capacitacion:this.form.value.capacitacion,
      asunto:this.form.value.asunto,
      descripcion:this.form.value.descripcion,
      monto:this.form.value.monto,
      estado:0,
      fecha_solicitud: new Date ().toISOString (),
    };

    this.database.addSolicitud(obj);

    this.showToast ('top-right');
    this.form.reset ();
    
  }
  
  showToast (position) {
    this.toastrService.show(
      '',
      'La Solicitud del solicitante: ' + this.form.value.nombre + ' se agrego correctamente',
      { position });
  }

  ngOnDestroy () {
    if (this.subscribe_01 !== null && this.subscribe_01 !== undefined) {
      this.subscribe_01.unsubscribe ();
    }

    if (this.subscribe_02 !== null && this.subscribe_02 !== undefined) {
      this.subscribe_02.unsubscribe ();
    }
    
  }

}
