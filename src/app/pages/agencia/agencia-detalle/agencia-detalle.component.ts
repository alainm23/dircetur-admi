import { Component, OnInit, TemplateRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

// Services
import { DatabaseService } from '../../../services/database.service';
import { AgenciaDatabaseService } from '../../../services/agencia-database.service';

import { FormGroup , FormControl, Validators } from '@angular/forms';

import { NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-agencia-detalle',
  templateUrl: './agencia-detalle.component.html',
  styleUrls: ['./agencia-detalle.component.scss']
})
export class AgenciaDetalleComponent implements OnInit {
  id: string;
  form: FormGroup;
  form_nuevo: FormGroup;
  form_sub: FormGroup;

  subscribe_01: any;
  subscribe_02: any;
  subscribe_03: any;
  subscribe_04: any;
  subscribe_05: any;
  subscribe_06: any;

  tipo_clasificaciones: any [];
  tipos_turismo: any [] = [];
  provincias: any [];
  distritos: any [];

  esta_distritos_cargando: boolean = true;
  representates: any [] = [];
  is_loading: boolean = false;
  is_email_valid: boolean = false;

  dialog_loading: boolean = false;
  reconocimientos: any [] = [];
  sanciones: any [] = [];

  data_reconocimientos: any [] = [];
  data_sanciones: any [] = [];
  representante_departamento: boolean = false;
  constructor(private route: ActivatedRoute,
              private agencia_db: AgenciaDatabaseService,
              private toastrService: NbToastrService,
              private dialogService: NbDialogService,
              private database: DatabaseService,) { }

  ngOnInit() {
    this.form_sub = new FormGroup ({
      descripcion: new FormControl ('', [Validators.required]),
    });

    this.form_nuevo = new FormGroup ({
      asunto:  new FormControl ('', [Validators.required]),
      descripcion: new FormControl ('', [Validators.required]),
      estado: new FormControl ('Pendiente')
    });

    this.form = new FormGroup ({
      id: new FormControl (''),
      nombre_comercial: new FormControl (''),
      direccion: new FormControl (''),
      telefono: new FormControl (''),
      pagina_web: new FormControl (''),
      nro_certificado: new FormControl ({value:'', disabled: true}),
      clasificacion: new FormControl (''),
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      correo: new FormControl ({value:'', disabled: true}, Validators.required),
      cuentas_redes_sociales: new FormControl (''),
      representante_nombre: new FormControl (''),
      representante_tdoc: new FormControl (''),
      representante_ndoc: new FormControl (''),
      representante_razon_social: new FormControl (''),
      representante_direccion: new FormControl (''),
      representante_provincia: new FormControl (''),
      representante_distrito: new FormControl (''),
      representante_ruc: new FormControl (),
      representante_departamento: new FormControl (),
    });

    this.route.params.subscribe (params => {
      this.id = params['id'];

      this.subscribe_05 = this.agencia_db.getAgencia (this.id).subscribe ((data: any) => {
        console.log (data);
            
        if (data.representante_departamento === undefined) {
          this.representante_departamento = false;
        } else {
          this.representante_departamento = true;
        }

        this.tipos_turismo = [];
        this.form.patchValue (data);
        
        this.subscribe_01 = this.agencia_db.getAgenciaTipo_Clasificaciones ().subscribe ((response: any []) => {
          this.tipo_clasificaciones = response;
        });
    
        this.subscribe_02 = this.agencia_db.getTipos_Turismo ().subscribe ((response: any []) => {
          response.forEach ((a) => {
            let item = data.tipos_turismo.find ((i: any) => {
              return i.id === a.id;
            });

            if (item !== undefined) {
              a = item;
            }

            this.tipos_turismo.push (a);
          });
        });
    
        this.subscribe_03 = this.database.getProvincias ().subscribe ((response: any []) => {
          this.provincias = response;

          this.provinciaChanged (data.provincia);
        });

        this.subscribe_06 = this.agencia_db.getAgenciaRepresentantes (this.id).subscribe ((res: any []) => {
          this.representates = res;
        })

        this.agencia_db.getAgenciaReconocimientos (this.id).subscribe ((res: any []) => {
          this.data_reconocimientos = res;
        });

        this.agencia_db.getAgenciaSanciones (this.id).subscribe ((res) => {
          this.data_sanciones = res;
        });

        this.database.getReconocimientos ().subscribe ((res: any []) => {
          this.reconocimientos = res;
        });

        this.database.getSanciones ().subscribe ((res: any []) => {
          this.sanciones = res;
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

  submit () {
    this.is_loading = true;

    let data: any = this.form.value;
    data.tipos_turismo = this.tipos_turismo.filter ((x: any) => {
      return x.checked === true;
    });

    
    if (this.representante_departamento === false) {
      delete data.representante_departamento; 
    }

    console.log (data);

    this.agencia_db.updateAgencia (data, []).then (() => {
      this.is_loading = false;;
      this.showToast ('top-right');
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
      'La Agencia: ' + this.form.value.nombre_comercial + ' se actualizo correctamente',
      { position });
  }

  abrir_dialogo (dialog: TemplateRef<any>, tipo: string) {
    this.dialogService.open (dialog, {
      context: tipo
    });
  }

  subsanadar_dialog (item: any, dialog: any) {
    console.log (item);

    this.dialogService.open (dialog, {
      context: item
    });
  }

  subsanar (ref: any, item) {
    console.log (item);
    this.dialog_loading = true;

    this.agencia_db.updateSancion (this.id, item, this.form_sub.value.descripcion)
      .then (() => {
        this.dialog_loading = false;
        this.form_sub.reset ();
        ref.close ();
      });
  }

  registrar (data: string, ref: any) {
    this.dialog_loading = true;

    if (data === 'Reconocimiento') {
      this.agencia_db.addAgenciaReconocimiento (this.id, this.form_nuevo.value)
        .then (() => {
          this.dialog_loading = false;
          ref.close ();
        })
        .catch ((error: any) => {
          this.dialog_loading = false;
          ref.close ();
          console.log ('Error', error);
        });
    } else {
      this.agencia_db.addAgenciaSancion (this.id, this.form_nuevo.value)
        .then (() => {
          this.dialog_loading = false;
          ref.close ();
        })
        .catch ((error: any) => {
          this.dialog_loading = false;
          ref.close ();
          console.log ('Error', error);
        });
    }
  }
}
