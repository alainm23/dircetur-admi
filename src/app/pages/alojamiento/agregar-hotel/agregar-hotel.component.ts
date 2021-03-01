import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';
import { AlojamientoDatabaseService } from '../../../services/alojamiento-database.service';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NbToastrService } from '@nebular/theme';
@Component({
  selector: 'ngx-agregar-hotel',
  templateUrl: './agregar-hotel.component.html',
  styleUrls: ['./agregar-hotel.component.scss']
})
export class AgregarHotelComponent implements OnInit {
  form: FormGroup;

  clases: any [];
  provincias: any [];
  distritos: any [];
  
  subscribe_01: any;
  subscribe_02: any;
  subscribe_03: any;
  subscribe_04: any;

  esta_distritos_cargando: boolean = true;
  socios: any [] = [];
  is_loading: boolean = false;
  is_email_valid: boolean = false;
  categoria_placeholder: string = "Categoria";
  constructor(private database:DatabaseService,
              private alojamiento_db: AlojamientoDatabaseService,
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
      numero_habitaciones: new FormControl ('', [Validators.required]),
      numero_camas: new FormControl ('', [Validators.required]),
      razon_social: new FormControl ('', Validators.required),
      ruc: new FormControl ('', Validators.required),
      direccion: new FormControl ('', Validators.required),
      telefono: new FormControl ('', Validators.required),
      pagina_web: new FormControl (''),
      numero_certificado: new FormControl ('', Validators.required),
      fecha_ins: new FormControl (''),
      fecha_exp: new FormControl (''),
      clase: new FormControl ('', Validators.required),
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

    this.subscribe_01 = this.alojamiento_db.getHotelTipo_Clasificaciones ().subscribe ((data) => {
      this.clases = data;
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
  }

  provinciaChanged (event: any) {
    if (event !== null || event !== undefined) {
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
      this.subscribe_03 = this.database.is_email_valid (this.form.value.correo).subscribe ((data) => {
        if (data === undefined || data === null) {
          this.is_email_valid = true;
        } else {
          this.is_email_valid = false;
        }
      });
    }
  }

  claseChanged () {
    console.log ("Cambio", this.form.value.clase);

    if (this.form.value.clase.id === 'J7kYDOGuZw6n1Otp87rR') {
      this.categoria_placeholder = "Albergue";
      this.form.controls ['categoria'].setValue ('Albergue');
    } else {
      this.categoria_placeholder = "Categoria";
    }
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

    this.alojamiento_db.addHotel (data, this.socios)
      .then (() => {
        this.is_loading = false;

        this.form.reset ();

        this.socios = [];
        this.agregarRepresentante ();
        this.showToast ('top-right');  
      }).catch ((error: any) => {
        this.is_loading = false;
        console.log ("Error addAgencia", error);
      });
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'EL alojamiento: ' + this.form.value.nombre_comercial + ' se agrego correctamente',
      { position });
  }

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
  }
}
