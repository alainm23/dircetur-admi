import { Component, OnInit, Input, TemplateRef} from '@angular/core';

import { DatabaseService } from '../../services/database.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { NbToastrService, NbComponentStatus, NbDialogRef } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';

import { first } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'ngx-viaje-programado-personas',
  templateUrl: './viaje-programado-personas.component.html',
  styleUrls: ['./viaje-programado-personas.component.scss']
})
export class ViajeProgramadoPersonasComponent implements OnInit {
  items: any [] = [];
  @Input() public viaje_id: string;
  @Input() public salida_id: string;

  view: string = "lista"; //  

  is_loading: boolean = false;
  changed_loading: boolean = false;
  is_loading_registro: boolean = false;
  form_dni: FormGroup;
  form: FormGroup;
  usuario_agregar: any;

  permiso:boolean = false;

  viaje: any;
  items_habilitado: boolean = false;
  constructor(private database: DatabaseService,
              protected ref: NbDialogRef<ViajeProgramadoPersonasComponent>,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService,) { }

  ngOnInit() {
    this.form_dni = new FormGroup ({
      dni: new FormControl (null, [Validators.required])
    });

    this.database.getViajesProgramadoById (this.viaje_id).subscribe ((res) => {
      this.viaje = res;
    });

    this.form = new FormGroup ({
      nombre_completo: new FormControl ('', [Validators.required]),
      correo: new FormControl ('',  [Validators.required, Validators.email]),
      telefono: new FormControl ('', [Validators.required]),
      fecha_nacimiento: new FormControl ('', [Validators.required]),
      genero: new FormControl ('0', [Validators.required]),
      ocupacion: new FormControl (''),
      nro_viajes: new FormControl (0)
    });
    
    console.log ('viaje_id', this.viaje_id);
    console.log ('salida_id', this.salida_id);
  }

  async verificar (dialog: TemplateRef<any>) {
    this.is_loading = true;
    const dni = String(this.form_dni.value.dni);

    const usuario_valid: any = await this.database.getUsuarioViajeProgramado (dni).pipe (first ()).toPromise ();

    console.log ('usuario_valid', usuario_valid);

    if (usuario_valid === null || usuario_valid === undefined) {
      this.is_loading = false;
      this.permiso = true;
    } else {
      if (usuario_valid.estado === true) {
        if (usuario_valid.nro_viajes >= 2) {
          this.form_dni.reset ();
          this.is_loading = false;
          const body = 'El usuario ' + usuario_valid.nombre_completo + ' se encuentra bloqueado por que supero la cantidad de viajes permitidos.';
          this.showToast ('No se puede registrar al usuario', body, 'danger');
        } else {
          const viaje_valid: any = await this.database.getValidViajeUsuarioViajeProgramado (dni, this.viaje_id).pipe (first ()).toPromise ();

          if (viaje_valid === null || viaje_valid === undefined) {
            this.database.addUsuarioViajeProgramado (usuario_valid, this.viaje, this.salida_id)
              .then (() => {
                this.is_loading = false;
                this.showToast ('Ingreso correcto', 'EL usuario se agrego con exito', 'success');
                this.cancelarNuevo ();
              })
              .catch ((error) => {
                this.showToast ('Error', error, 'danger');
              });
          } else {
            if (this.viaje.ultimo_viaje_fecha_salida === viaje_valid.ultima_salida) {
              this.form_dni.reset ();
              this.is_loading = false;
              const body = 'El usuario ' + usuario_valid.nombre_completo + ' ya esta registrado para este viaje';
              this.showToast ('No se puede registrar al usuario', body, 'danger');
            } else {
              this.is_loading = false;

              this.usuario_agregar = {
                usuario: usuario_valid,
                viaje: viaje_valid
              };

              this.open_dialog (dialog, usuario_valid, viaje_valid);
            }
          }
        }
      } else {
        this.form_dni.reset ();
        this.is_loading = false;
        const body = 'El usuario ' + usuario_valid.nombre_completo + ' se encuentra bloqueado.';
        this.showToast ('No se puede registrar al usuario', body, 'danger');
      }
    }
  }

  checkedChanged (item: any) {
    item.checked = !item.checked;
  }

  agregarViajero () {
    this.view = "nuevo";
  }

  getDateFormat (date: string) {
    return moment (date).format ('LLL');
  }
  
  cancelarNuevo () {
    this.permiso = false;
    this.view = "lista";
    this.form_dni.reset ();
    this.form.reset ();
  }

  registrar () {
    this.is_loading_registro = true;

    let data = this.form.value;

    data.dni = String(this.form_dni.value.dni);
    data.fecha_nacimiento = new Date (this.form.value.fecha_nacimiento).toISOString ();
    data.fecha_creado = new Date ().toISOString ();
    data.estado = true;
    data.checked = false;
    
    this.database.addViajeroViajeProgramado (this.viaje, this.salida_id, data)
      .then (() => {
        this.is_loading_registro = false;
        this.showToast ('Ingreso correcto', 'EL usuario se registro con exito', 'success');
        this.cancelarNuevo ();
      })
      .catch ((error) => {
        this.is_loading_registro = false;
        this.showToast ('Error', error, 'danger');
      });
  }

  showToast (title: any, body: string, status: NbComponentStatus) {
    const duration: any = 5000;
    const position: any = 'top-right';
    this.toastrService.show(
      body,
      title,
      { position, status, duration });
  }

  close () {
    this.ref.close ();
  }

  habilitar () {
    this.items_habilitado = !this.items_habilitado;
  }

  checkChanged (event: any, item: any) {
    this.changed_loading = true;

    console.log (event);
    console.log (item);

    if (event === false) {
      this.database.addUsuarioSancion (item, this.viaje, this.salida_id)
        .then (() => {
          this.changed_loading = false;
        })
        .catch ((error) => {
          this.changed_loading = false;
          console.log ('addUsuarioSancion error', error)
        });
    } else { 
      this.database.removeUsuarioSancion (item, this.viaje, this.salida_id)
        .then (() => {
          this.changed_loading = false;
        })
        .catch ((error) => {
          this.changed_loading = false;
          console.log ('removeUsuarioSancion error', error)
        });
    }
  }

  cerrar_viaje (dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: '¿Esta seguro que debesea cerrar este viaje? Aceptando confirmación, no volvera a poder cambiar la asistencia' });
  }

  cerrar_viaje_yes () {
    this.database.cerrarViaje (this.viaje_id, this.salida_id)
      .then (() => {
        this.ref.close ();
      })
      .catch ((error) => {
        console.log ('cerrarViaje', error);
      });
  }

  open_dialog (dialog: TemplateRef<any>, usuario: any, viaje: any) {
    this.dialogService.open(dialog, { 
      context: 'El usuario ' + usuario.nombre_completo + ' ya participo en este viaje el ' + this.getDateFormat (viaje.ultima_salida) + '. ¿Desea agregarlo de todas formas?' 
    });
  }

  agregar_de_todas_formas (ref: any) {
    this.database.addViajeroForzadoViajeProgramado (this.salida_id, this.usuario_agregar)
      .then (() => {
        this.showToast ('Ingreso correcto', 'EL usuario se registro con exito', 'success');
        this.cancelarNuevo ();
        ref.close ();
      })
      .catch ((error: any) => {
        console.log ('addViajeroForzadoViajeProgramado', error);
        ref.close ();
      });
  } 

  close_alert_dialog (ref: any) {
    ref.close ();
  }

  eliminar_salida () {
    if(confirm("¿Esta seguro que desea eliminar esta salida?")) {
      console.log("Implement delete functionality here");

      this.database.deleteSalidaViajeProgramado (this.viaje_id, this.salida_id)
        .then (() => {
          this.ref.close();
        })
        .catch ((error) => {

        });
    }
  }
}