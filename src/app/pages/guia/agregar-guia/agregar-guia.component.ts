import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';
import { GuiaDatabaseService } from '../../../services/guia-database.service';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NbToastrService } from '@nebular/theme';
@Component({
  selector: 'ngx-agregar-guia',
  templateUrl: './agregar-guia.component.html',
  styleUrls: ['./agregar-guia.component.scss']
})
export class AgregarGuiaComponent implements OnInit {
  form: FormGroup;
  idiomas: any [];
  tipos: any [];
  centro_formacion: any [];
  asociacion_colegio: any [];

  provincias: any [];
  distritos: any [];
  esta_distritos_cargando: boolean = true;
  
  subscribe_01: any;
  subscribe_02: any;
  subscribe_03: any;
  subscribe_04: any;
  subscribe_05: any;
  subscribe_06: any;
  subscribe_07: any;
  subscribe_08: any;

  is_loading: boolean = false;
  is_email_valid: boolean = false;
  constructor(private database:DatabaseService,
              private guia_db: GuiaDatabaseService,
              private toastrService: NbToastrService) { }

  ngOnInit() {
    this.form = new FormGroup ({
      ruc: new FormControl ('', Validators.required),
      nombre_completo: new FormControl ('', Validators.required),
      nro_documento: new FormControl ('', Validators.required),
      nro_carne: new FormControl ('', Validators.required),
      direccion: new FormControl ('', Validators.required),
      telefono: new FormControl ('', Validators.required),
      correo_personal: new FormControl ('', Validators.required),
      fecha_exp: new FormControl ('', Validators.required),
      fecha_ins: new FormControl ('', Validators.required),
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      idioma: new FormControl (''),
      centro_formacion: new FormControl ('', Validators.required),
      asociacion_colegio: new FormControl ('', Validators.required),
      correo: new FormControl ('', Validators.required),
      contraseña: new FormControl ('', Validators.required),
    });

    this.subscribe_03 = this.database.getProvincias ().subscribe ((response: any []) => {
      this.provincias = response;
    });

    this.subscribe_01 = this.guia_db.getGuia_Idiomas ().subscribe ((data) => {
      this.idiomas = data;
    }); 

    this.subscribe_02 = this.guia_db.getGuia_Tipo_Guiado ().subscribe ((data) => {
      this.tipos = data;
    }); 
    
    this.subscribe_04 = this.guia_db.getGuia_Centro_Formacion ().subscribe ((res: any []) => {
      this.centro_formacion = res;
    });

    this.subscribe_05 = this.guia_db.getGuia_Asociacion_Colegio ().subscribe ((res: any []) => {
      this.asociacion_colegio = res;
    });
  }
  
  checkedChanged (item: any) {
    item.checked = !item.checked;
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
      'El guia: ' + this.form.value.nombre_completo + ' se agrego correctamente',
      { position });
  }

  submit () {
    this.is_loading = true;

    let data: any = this.form.value;
    data.tipo_guiado = this.tipos.filter ((x: any) => {
      return x.checked === true;
    });

    data.idiomas = this.idiomas.filter ((x: any) => {
      return x.checked === true;
    });

    data.fecha_exp = new Date(data.fecha_exp).toISOString ();
    data.fecha_ins = new Date(data.fecha_ins).toISOString ();

    console.log (data);

    this.guia_db.addGuia (data)
      .then (() => {
        this.is_loading = false;
        this.showToast ('top-right');        
        this.form.reset ();
      }).catch ((error: any) => {
        this.is_loading = false;
        console.log ("Error addAgencia", error);
      });
  }

  provinciaChanged (event: any) {
    this.esta_distritos_cargando = true;
    console.log (event);
    this.subscribe_07 = this.database.getDistritosByProvincias (event.id).subscribe ((response: any []) => {
      this.distritos = response;
      this.esta_distritos_cargando = false;
    }, (error: any) => {
      console.log ('getDistritosByProvincias', error);
      this.esta_distritos_cargando = true;
    });
  }

  getObject (item: any) {
    return {
      id: item.id,
      nombre: item.nombre
    };
  }

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
  }
}
