import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';
import { AgenciaDatabaseService } from '../../../services/agencia-database.service';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-agregar-agencia',
  templateUrl: './agregar-agencia.component.html',
  styleUrls: ['./agregar-agencia.component.scss']
})
export class AgregarAgenciaComponent implements OnInit {
  form: FormGroup;

  subscribe_01: any;
  subscribe_02: any;
  subscribe_03: any;
  subscribe_04: any;

  tipo_clasificaciones: any [];
  modalidad_turismo: any [];
  tipos_turismo: any [];
  provincias: any [];
  distritos: any [];

  esta_distritos_cargando: boolean = true;
  socios: any [] = [];
  is_loading: boolean = false;
  is_email_valid: boolean = false;
  constructor(private database: DatabaseService,
              private agencia_db: AgenciaDatabaseService,
              private toastrService: NbToastrService) { }

  ngOnInit() {
    this.socios.push ({
      id:  this.database.createId (),
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
      razon_social: new FormControl ('', Validators.required),
      ruc: new FormControl ('', Validators.required),
      direccion: new FormControl ('', Validators.required),
      telefono: new FormControl ('', Validators.required),
      pagina_web: new FormControl (''),
      nro_certificado: new FormControl ('', Validators.required),
      fecha_ins: new FormControl (''),
      fecha_exp: new FormControl (''),
      clasificacion: new FormControl ('', Validators.required),
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      servicios_complementarios: new FormControl (''),
      observaciones: new FormControl (''),
      representante_nombre: new FormControl ('', Validators.required),
      representante_tdoc: new FormControl ('', Validators.required),
      representante_ndoc: new FormControl ('', Validators.required),
      representante_telefono: new FormControl ('', Validators.required),
      representante_direccion: new FormControl ('', Validators.required),
      representante_correo: new FormControl ('', Validators.required),
      correo: new FormControl ('', Validators.required),
      password: new FormControl ('', Validators.required),
    });

    this.subscribe_01 = this.agencia_db.getAgenciaTipo_Clasificaciones ().subscribe ((response: any []) => {
      this.tipo_clasificaciones = response;
    });

    this.subscribe_02 = this.agencia_db.getModalidad_Turismo ().subscribe ((response: any []) => {
      this.modalidad_turismo = response;
    });

    this.agencia_db.getTipos_Turismo ().subscribe ((res: any []) => {
      this.tipos_turismo = res;
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

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
  }
  
  agregarRepresentante () {
    this.socios.push ({
      id: this.database.createId (),
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
      if ( this.socios[i].id === item.id) {
        this.socios.splice(i, 1); 
      }
    }
  }

  submit () {
    console.log (this.form);
    this.is_loading = true;

    let data: any = this.form.value;
    data.modalidad_turismo = this.modalidad_turismo.filter ((x: any) => {
      return x.checked === true;
    });

    data.tipos_turismo = this.tipos_turismo.filter ((x: any) => {
      return x.checked === true;
    });

    data.fecha_exp = new Date(data.fecha_exp).toISOString ();
    data.fecha_ins = new Date(data.fecha_ins).toISOString ();
    
    console.log (data);

    this.socios.forEach ((d) => {
      console.log (d);
    });

    this.agencia_db.addAgencia (data, this.socios)
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

  checkedChanged (item: any) {
    item.checked = !item.checked;
  }
  
  validChanged () {
    if (this.form.value.correo != "") {
      this.database.is_email_valid (this.form.value.correo).subscribe ((data) => {
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
      'La Agencia: ' + this.form.value.nombre_comercial + ' se agrego correctamente',
      { position });
  }
}
