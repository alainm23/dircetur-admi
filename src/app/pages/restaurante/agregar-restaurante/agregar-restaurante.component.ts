import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';
import { RestauranteDatabaseService } from '../../../services/restaurante-database.service';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-agregar-restaurante',
  templateUrl: './agregar-restaurante.component.html',
  styleUrls: ['./agregar-restaurante.component.scss']
})
export class AgregarRestauranteComponent implements OnInit {
  form: FormGroup;

  clasificaciones: any [];
  categorias: any [];
  provincias: any [];
  distritos: any [];

  subscribe_01: any;
  subscribe_02: any;
  subscribe_03: any;
  subscribe_04: any;
  subscribe_05: any;
  subscribe_06: any;

  esta_distritos_cargando: boolean = true;
  socios: any [] = [];
  is_loading: boolean = false;
  is_email_valid: boolean = false;
  constructor(private database:DatabaseService,
              private rest_db: RestauranteDatabaseService,
              private toastrService: NbToastrService) { }

  ngOnInit() {
    this.socios.push ({
      _id:  Math.random(),
      nombre: '',
      correo: '',
      tdoc: 'DNI',
      ndoc: '',
      direccion: '',
      telefono: '',
      eliminado: false
    });

    this.form = new FormGroup ({
      nombre_comercial: new FormControl ('', [Validators.required]),
      cantidad_mesas: new FormControl ('', [Validators.required]),
      cantidad_sillas: new FormControl ('', [Validators.required]),
      razon_social: new FormControl ('', Validators.required),
      ruc: new FormControl ('', Validators.required),
      direccion: new FormControl ('', Validators.required),
      telefono: new FormControl ('', Validators.required),
      pagina_web: new FormControl (''),
      numero_certificado: new FormControl ('', Validators.required),
      fecha_ins: new FormControl ('', Validators.required),
      fecha_exp: new FormControl ('', Validators.required),
      calificacion: new FormControl ('', Validators.required),
      categoria: new FormControl ('', Validators.required),
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      servicios_complementarios: new FormControl (''),
      observaciones: new FormControl (''),
      correo: new FormControl ('', Validators.required),
      password: new FormControl ('', Validators.required),
      representante_nombre: new FormControl ('', Validators.required),
      representante_tdoc: new FormControl ('', Validators.required),
      representante_ndoc: new FormControl ('', Validators.required),
      representante_telefono: new FormControl ('', Validators.required),
      representante_direccion: new FormControl ('', Validators.required),
      representante_correo: new FormControl ('', Validators.required),
    });

    this.subscribe_01 = this.rest_db.getRestaurante_Clasificaciones ().subscribe ((response: any []) => {
      this.clasificaciones = response;
      console.log ('clasificaciones', response);
    });

    this.subscribe_02 = this.rest_db.getRestaurante_Categorias ().subscribe ((response: any []) => {
      this.categorias = response;
      console.log ('categorias', response);
    });

    this.subscribe_03 = this.database.getProvincias ().subscribe ((response: any []) => {
      this.provincias = response;
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

    if (this.subscribe_04 !== null && this.subscribe_04 !== undefined) {
      this.subscribe_04.unsubscribe ();
    }

    if (this.subscribe_05 !== null && this.subscribe_05 !== undefined) {
      this.subscribe_05.unsubscribe ();
    }

    if (this.subscribe_06 !== null && this.subscribe_06 !== undefined) {
      this.subscribe_06.unsubscribe ();
    }
  }

  provinciaChanged (event: any) {
    this.esta_distritos_cargando = true;
    console.log (event);
    this.subscribe_04 = this.database.getDistritosByProvincias (event.id).subscribe ((response: any []) => {
      this.distritos = response;
      this.esta_distritos_cargando = false;
    }, (error: any) => {
      console.log ('getDistritosByProvincias', error);
      this.esta_distritos_cargando = true;
    });
  }

  agregarRepresentante () {
    this.socios.push ({
      _id:  Math.random(),
      nombre: '',
      email: '',
      tdoc: 'DNI',
      ndoc: '',
      direccion: '',
      telefono: ''
    });
  }

  eliminarRepresentante (item: any) {
    for( var i = 0; i < this.socios.length; i++){ 
      if ( this.socios[i]._id === item._id) {
        this.socios.splice(i, 1); 
      }
    }
  }

  validChanged () {
    if (this.form.value.correo != "") {
      this.subscribe_05 = this.database.is_email_valid (this.form.value.correo).subscribe ((data) => {
        if (data === undefined || data === null) {
          this.is_email_valid = true;
        } else {
          this.is_email_valid = false;
        }
      });
    }
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'EL restaurante: ' + this.form.value.nombre_comercial + ' se agrego correctamente',
      { position });
  }

  submit () {
    this.is_loading = true;

    let data: any = this.form.value;

    data.fecha_exp = new Date(data.fecha_exp).toISOString ();
    data.fecha_ins = new Date(data.fecha_ins).toISOString ();

    console.log (data);

    this.socios.forEach ((d) => {
      console.log (d);
    });

    this.rest_db.addRestaurante (data, this.socios)
      .then (() => {
        this.is_loading = false;
        this.socios = [];
        this.agregarRepresentante ();
        this.showToast ('top-right');
        
        this.form.reset ();
      }).catch ((error: any) => {
        this.is_loading = false;
        console.log ("Error addAgencia", error);
      });
  }

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
  }
}
