import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { DatabaseService } from '../../../services/database.service';
import { NbToastrService, NbComponentStatus, NbPopoverDirective } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ViajeProgramadoPersonasComponent } from '../../../dialogs/viaje-programado-personas/viaje-programado-personas.component';

import * as moment from 'moment';
import { first } from 'rxjs/operators';

@Component({
  selector: 'ngx-viaje-programado-panel',
  templateUrl: './viaje-programado-panel.component.html',
  styleUrls: ['./viaje-programado-panel.component.scss']
})
export class ViajeProgramadoPanelComponent implements OnInit {
  @ViewChild(NbPopoverDirective, { static: false }) popover: NbPopoverDirective;

  items: any [] = [];
  form: FormGroup;
  form_edit: FormGroup;

  historial: any [] = [];
  viajeros: any [] = [];
  viajeros_checklist: any [] = [];

  item_selected: any = null;
  is_loading: boolean = false;
  viajeros_loading: boolean = false;
  crud_loading: boolean = false;

  view: string = "panel"; // historial, viajeros
  constructor (private database: DatabaseService, 
              private toastrService: NbToastrService,
              private dialogService: NbDialogService) { }

  ngOnInit() {
    this.form = new FormGroup ({
      fecha_salida: new FormControl ('', [Validators.required]),
      fecha_limite: new FormControl ('', [Validators.required]),
      cupos: new FormControl ('', [Validators.required]),
      precio: new FormControl ('', [Validators.required]),
      tipo_registro: new FormControl ('', [Validators.required]),
    });

    this.form_edit = new FormGroup ({
      fecha_salida: new FormControl ('', [Validators.required]),
      fecha_limite: new FormControl ('', [Validators.required]),
      cupos: new FormControl ('', [Validators.required]),
      precio: new FormControl ('', [Validators.required]),
    });
    
    this.database.getViajesProgramados ().subscribe ((res: any []) => {
      this.items = res;
      console.log (res);
    });
  }

  getDateFormat (date: string) {
    return moment (date).format ('LLL');
  }

  agregar_salida (item: any, dialog: TemplateRef<any>) {
    this.item_selected = item;
    this.dialogService.open(dialog);
  }

  crear_salida (ref: any) {
    if (this.item_selected != null) {
      this.is_loading = true;
      const data = this.form.value;

      console.log (data);

      data.fecha_creado = new Date().toISOString ();

      data.estado = 0;

      this.database.addSalidaViajeProgramado (this.item_selected, data)
        .then (() => {
          this.form.reset ();
          ref.close ();
          this.is_loading = false;

          this.showToast ('OK', 'La salida se registro exitosamente', 'success');
        })
        .catch ((error: any) => {
          this.is_loading = false;
          alert (error);
        });
    }
  }

  cerrar_dialog (ref: any) {
    this.item_selected = null;
    ref.close ();
  }

  checklist (item: any) {
    this.view = 'checklist';
    this.item_selected = item;

    this.database.getViajerosBySalida (item.id, item.ultimo_viaje_id).subscribe ((res: any []) => {
      this.viajeros_checklist = res;
      console.log (this.items);
    });
    /*.
    
    */
  }

  agregarViajero () {
    if (this.item_selected !== null) {
      this.dialogService.open (ViajeProgramadoPersonasComponent, {
        context: {
          viaje_id: this.item_selected.id,
          salida_id: this.item_selected.ultimo_viaje_id
        }
      }); 
    }
  }

  showToast (title: any, body: string, status: NbComponentStatus) {
    const position: any = 'top-right';
    const duration: any = 3000;
    this.toastrService.show(
      body,
      title,
      { position, status, duration });
  }

  ver_historial (item: any) {
    console.log (item);

    this.item_selected = item;
    this.view = 'historial';
    this.is_loading = true;

    this.database.getViajesProgramadosHistorial (item.id).subscribe ((res) => {
      this.historial = res;
      this.is_loading = false;
    });
  }

  ver_pasajeros (item: any, dialog: any) {
    this.viajeros_loading = true;

    this.dialogService.open (dialog);

    this.database.getSalidasViaje (this.item_selected.id, item.id).subscribe ((res: any []) => {
      this.viajeros = res;
      this.viajeros_loading = false;
    });
  }

  ir_vista (val: string) {
    this.view = val;
  }

  cerrar_viaje () {
    if (this.item_selected !== null) {
      if(confirm("¿Esta seguro que desea eliminar a " + this.item_selected.nombre_completo + "?")) {
        this.database.cerrarViaje (this.item_selected.id, this.item_selected.ultimo_viaje_id)
          .then (() => {
            console.log ('Viaje cerrado exitosamente');
          })
          .catch ((error) => {
            console.log ('cerrarViaje', error);
          });
      }
    }
  }
  
  eliminar_salida (item: any) {
    if(confirm("¿Esta seguro que desea eliminar esta salida programada")) {
      this.database.eliminarSalida (item)
        .then (() => {
          console.log ("Se elimino bien");
        })
        .catch ((error: any) => {
          console.log ("Error", error);
        });
    }
  }

  checkChanged (event: any, item: any) {
    this.viajeros_loading = true;

    console.log (event);
    console.log (item);

    if (event === false) {
      this.database.addUsuarioSancion (item, this.item_selected, this.item_selected.ultimo_viaje_id)
        .then (() => {
          this.viajeros_loading = false;
        })
        .catch ((error) => {
          this.viajeros_loading = false;
          console.log ('addUsuarioSancion error', error)
        });
    } else { 
      this.database.removeUsuarioSancion (item, this.item_selected, this.item_selected.ultimo_viaje_id)
        .then (() => {
          this.viajeros_loading = false;
        })
        .catch ((error) => {
          this.viajeros_loading = false;
          console.log ('removeUsuarioSancion error', error)
        });
    }
  }

  async editar_datos (item: any) {
    console.log ('item', item);

    const data: any = await this.database.getSalidaById (item).pipe (first ()).toPromise ();

    console.log ('data', data);

    this.form_edit.controls ['fecha_salida'].setValue (data.fecha_salida.substring (0, 16));
    this.form_edit.controls ['fecha_limite'].setValue (data.fecha_limite.substring (0, 16));

    this.form_edit.controls ['precio'].setValue (data.precio);

    this.form_edit.controls ['cupos'].setValue (data.cupos);
    this.form_edit.controls ['cupos'].setValidators ([Validators.required, Validators.min (data.cupos)]);
  }

  actualizar_salida (item: any) {
    this.crud_loading = true;

    const data = this.form_edit.value;

    console.log (data);

    this.database.updateSalida (item, data)
      .then (() => {
        this.popover.hide();
        this.crud_loading = false;
      })
      .catch (() => {
        this.popover.hide();
        this.crud_loading = false;
      });
  }

  eliminar_viajero (item: any) {
    if(confirm("¿Esta seguro que desea eliminar a " + item.nombre_completo + "?")) {
      console.log("Implement delete functionality here");

      this.database.deleteViajero (this.item_selected, item)
        .then (() => {
          console.log ("Se elimino bien");
        })
        .catch ((error: any) => {
          console.log ("Error", error);
        });
    }
  }
}
