import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';
import { RestauranteDatabaseService } from '../../../services/restaurante-database.service';
import { ActivatedRoute } from '@angular/router';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-restaurante-detalle',
  templateUrl: './restaurante-detalle.component.html',
  styleUrls: ['./restaurante-detalle.component.scss']
})
export class RestauranteDetalleComponent implements OnInit {
  form: FormGroup;
  id: string;

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
  subscribe_07: any;

  esta_distritos_cargando: boolean = true;
  representates: any [] = [];
  is_loading: boolean = false;
  is_email_valid: boolean = false;
  constructor(private database:DatabaseService,
              private rest_db: RestauranteDatabaseService,
              private route: ActivatedRoute,
              private toastrService: NbToastrService) { }

  ngOnInit() {
    this.representates.push ({
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
      id: new FormControl (''),
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
      contraseña: new FormControl ('', Validators.required),
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];
      
      this.subscribe_01 = this.rest_db.getRestauranteById (this.id).subscribe ((data: any) => {

        console.log (data);
    
        this.form.patchValue (data);

        this.form.controls ["fecha_ins"].setValue (new Date (data.fecha_ins));
        this.form.controls ["fecha_exp"].setValue (new Date (data.fecha_exp));

        this.subscribe_02 = this.database.getProvincias ().subscribe ((response: any []) => {
          this.provincias = response;

          this.provinciaChanged (data.provincia);
        });
    

        this.subscribe_03 = this.rest_db.getRestaurante_Clasificaciones ().subscribe ((response: any []) => {
          this.clasificaciones = response;
        });
    
        this.subscribe_04 = this.rest_db.getRestaurante_Categorias ().subscribe ((response: any []) => {
          this.categorias = response;
        });
        
        this.subscribe_07 = this.rest_db.getRestauranteRepresentantes (this.id).subscribe ((res) => {
          this.representates = res;
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

    if (this.subscribe_04 !== null && this.subscribe_04 !== undefined) {
      this.subscribe_04.unsubscribe ();
    }

    if (this.subscribe_05 !== null && this.subscribe_05 !== undefined) {
      this.subscribe_05.unsubscribe ();
    }

    if (this.subscribe_06 !== null && this.subscribe_06 !== undefined) {
      this.subscribe_06.unsubscribe ();
    }

    if (this.subscribe_07 !== null && this.subscribe_07 !== undefined) {
      this.subscribe_07.unsubscribe ();
    }
  }

  provinciaChanged (event: any) {
    if (event !== null || event !== undefined) {
      this.esta_distritos_cargando = true;
      console.log (event);
      this.subscribe_05 = this.database.getDistritosByProvincias (event.id).subscribe ((response: any []) => {
        this.distritos = response;
        this.esta_distritos_cargando = false;
      }, (error: any) => {
        console.log ('getDistritosByProvincias', error);
        this.esta_distritos_cargando = true;
      });
    }
  }

  agregarRepresentante () {
    this.representates.push ({
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
    for( var i = 0; i < this.representates.length; i++){ 
      if ( this.representates[i]._id === item._id) {
        this.representates.splice(i, 1); 
      }
    }
  }

  validChanged () {
    if (this.form.value.correo != "") {
      this.subscribe_06 = this.database.is_email_valid (this.form.value.correo).subscribe ((data) => {
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
      'EL restaurante: ' + this.form.value.nombre_comercial + ' se actualizo correctamente',
      { position });
  }

  submit () {
    this.is_loading = true;

    let data: any = this.form.value;

    data.fecha_exp = new Date(data.fecha_exp).toISOString ();
    data.fecha_ins = new Date(data.fecha_ins).toISOString ();

    console.log (data);

    this.representates.forEach ((d) => {
      console.log (d);
    });

    this.rest_db.updateRestaurante (data, this.representates)
      .then (() => {
        this.is_loading = false;
        this.showToast ('top-right');
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
