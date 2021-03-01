import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { NbToastrService } from '@nebular/theme';
//import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'ngx-agregar-solicitud',
  templateUrl: './agregar-solicitud.component.html',
  styleUrls: ['./agregar-solicitud.component.scss']
})
export class AgregarSolicitudComponent implements OnInit {
form: FormGroup;
provincias: any [];
distritos: any [];
subscribe_01: any;
subscribe_02: any;
esta_distritos_cargando: boolean = true;
  constructor(
    public database: DatabaseService,
    public toastrService: NbToastrService
    //private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.form = new FormGroup ({
      tipo: new FormControl ('', [Validators.required]),
      nombre: new FormControl ('', [Validators.required]),
      apellido: new FormControl ('', [Validators.required]),
      n_doc: new FormControl ('', [Validators.required]),
      razon_social: new FormControl (''),
      nombre_comercial: new FormControl (''),
      correo: new FormControl ('', [Validators.required, Validators.email]),
      telefono: new FormControl ('', [Validators.required]),
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      direccion_completa: new FormControl ('', Validators.required)
    });

    this.subscribe_01 = this.database.getProvincias ().subscribe ((response: any []) => {
      this.provincias = response;
    });
  }
  
  provinciaChanged (event: any) {
    this.esta_distritos_cargando = true;
    console.log (event);
    this.subscribe_02 = this.database.getDistritosByProvincias (event.id).subscribe ((response: any []) => {
      this.distritos = response;
      this.esta_distritos_cargando = false;
    }, (error: any) => {
      console.log ('getDistritosByProvincias', error);
      this.esta_distritos_cargando = true;
    });
  }

  submit () {
    let obj: any = {
      id:String(this.form.value.n_doc),
      tipo:this.form.value.tipo,
      nombre:this.form.value.nombre,
      apellido:this.form.value.apellido,
      n_doc:this.form.value.n_doc,
      razon_social:this.form.value.razon_social,
      nombre_comercial:this.form.value.nombre_comercial,
      correo:this.form.value.correo,
      telefono:this.form.value.telefono,
      provincia:this.form.value.provincia,
      distrito:this.form.value.distrito,
      direccion_completa:this.form.value.direccion_completa,
      date_added: new Date ().toISOString ()
    };

    this.database.addSolicitante(obj);

    this.showToast ('top-right');
    this.form.reset ();
    
  }
  
  showToast (position) {
    this.toastrService.show(
      '',
      'El Solicitante: ' + this.form.value.nombre + ' se agrego correctamente',
      { position });
  }

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
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
