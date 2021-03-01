import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
// Services
import { DatabaseService } from '../../../services/database.service';
import { AlojamientoDatabaseService } from '../../../services/alojamiento-database.service';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';

import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-alojamiento-detalle',
  templateUrl: './alojamiento-detalle.component.html',
  styleUrls: ['./alojamiento-detalle.component.scss']
})
export class AlojamientoDetalleComponent implements OnInit {
  id: string = '';
  form: FormGroup;

  clases: any [];
  provincias: any [];
  distritos: any [];
  
  subscribe_01: any;
  subscribe_02: any;
  subscribe_03: any;
  subscribe_04: any;
  subscribe_05: any;

  esta_distritos_cargando: boolean = true;
  representates: any [] = [];
  is_loading: boolean = false;
  is_email_valid: boolean = false;
  categoria_placeholder: string = "Categoria";
  constructor(private route: ActivatedRoute,
              private toastrService: NbToastrService,
              private alojamiento_db: AlojamientoDatabaseService,
              private database: DatabaseService,) { }

  ngOnInit() {
    this.form = new FormGroup ({
      id: new FormControl (''),
      nombre_comercial: new FormControl ('', [Validators.required]),
      numero_habitaciones: new FormControl ('', [Validators.required]),
      numero_camas: new FormControl ('', [Validators.required]),
      razon_social: new FormControl ('', Validators.required),
      ruc: new FormControl ({value: '', disabled: true}, Validators.required),
      direccion: new FormControl ('', Validators.required),
      telefono: new FormControl ('', Validators.required),
      pagina_web: new FormControl (''),
      nro_certificado: new FormControl ({value: '', disabled: true}, Validators.required),
      correo: new FormControl ({value: '', disabled: true}, Validators.required),
      ingreso_diferenciado: new FormControl ('', Validators.required),
      numero_pisos: new FormControl ('', Validators.required),
      numero_personal: new FormControl ('', Validators.required),
      nro_banios_privados: new FormControl ('', Validators.required),
      nro_banios_comunes: new FormControl ('', Validators.required),
      // fecha_ins: new FormControl ('', Validators.required),
      // fecha_exp: new FormControl ('', Validators.required),
      // clase: new FormControl ('', Validators.required),
      // categoria: new FormControl ('', Validators.required),
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      // servicios_complementarios: new FormControl (''),
      // observaciones: new FormControl (''),
      representante_nombre: new FormControl (''),
      representante_tdoc: new FormControl (''),
      representante_ndoc: new FormControl (''),
      // representante_direccion: new FormControl (''),
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];

      this.alojamiento_db.getHotel (this.id).subscribe ((data: any) => {
        console.log (data);

        this.form.patchValue (data);

        // this.form.controls ["fecha_ins"].setValue (new Date (data.fecha_ins));
        // this.form.controls ["fecha_exp"].setValue (new Date (data.fecha_exp));

        this.subscribe_03 = this.database.getProvincias ().subscribe ((response: any []) => {
          this.provincias = response;

          this.provinciaChanged (data.provincia);
        });

        this.subscribe_01 = this.alojamiento_db.getHotelTipo_Clasificaciones ().subscribe ((data) => {
          this.clases = data;
        });

        this.subscribe_05 = this.alojamiento_db.getHotelRepresentantes (this.id).subscribe ((data: any []) => {
          this.representates = data;
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
  }

  provinciaChanged (event: any) {
    if (event !== null || event !== undefined) {
      this.esta_distritos_cargando = true;
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

    this.alojamiento_db.updateHotel (data, [])
      .then (() => {
        this.is_loading = false;
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
