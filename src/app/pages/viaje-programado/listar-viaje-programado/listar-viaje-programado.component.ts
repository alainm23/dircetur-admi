import { Component, OnInit, TemplateRef } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';

import { ViajeProgramadoPersonasComponent } from '../../../dialogs/viaje-programado-personas/viaje-programado-personas.component';

import * as moment from 'moment';

@Component({
  selector: 'ngx-listar-viaje-programado',
  templateUrl: './listar-viaje-programado.component.html',
  styleUrls: ['./listar-viaje-programado.component.scss']
})
export class ListarViajeProgramadoComponent implements OnInit {
  items: any [];
  salidas: any [];
  item_selected: any;
  form: FormGroup;
  
  constructor (private database: DatabaseService, 
              private router: Router,
              private dialogService: NbDialogService) { }

  ngOnInit() {
    this.form = new FormGroup ({
      fecha_salida: new FormControl ('', [Validators.required]),
      fecha_inscripcion: new FormControl (''),
      hora: new FormControl ('', [Validators.required]),
      cupos: new FormControl ('', [Validators.required]),
      precio: new FormControl ('', [Validators.required])
    });

    this.database.getViajesProgramados ().subscribe ((res: any []) => {
      this.items = res;

      if (this.items.length > 0) {
        this.select_item (this.items [0]);
      } 
    });
  }

  elimninar (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log (item);
      this.database.deleteViajesProgramados (item)
      .then (() => {
        console.log ("Elininado");
      })
      .catch (error => {
        console.log ("error", error);
      });
    } else {
      console.log ("Cancelar");
    }
  }

  editar (item: any) {
    this.router.navigate(['/pages/viaje-programado/viaje-programado-detalle', item.id]);
  }

  checklist (item: any) {
    this.dialogService.open (ViajeProgramadoPersonasComponent, {
      context: {
        viaje_id: this.item_selected.id,
        salida_id: item.id
      }
    });
  }

  agregar_salida (dialog: TemplateRef<any>) {
    if (this.item_selected != null) {
      this.dialogService.open(dialog);
    }
  }

  select_item (item: any) {
    this.item_selected = item;

    console.log (this.item_selected);

    this.database.getSalidasViajeProgramado (this.item_selected.id).subscribe ((res) => {
      console.log (res);
      this.salidas = res;
    });
  }

  crear_salida (ref: any) {
    if (this.item_selected != null) {
      const data = this.form.value;

      data.fecha_salida = new Date(data.fecha_salida).toISOString ();
      data.fecha_creado = new Date().toISOString ();
      data.estado = true;

      this.database.addSalidaViajeProgramado (this.item_selected, data)
        .then (() => {
          this.form.reset ();
          ref.close ();
        })
        .catch ((error: any) => {
          
        });
    }
  }

  eliminarSalida (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log (item);
      this.database.deleteSalidaViajeProgramado (this.item_selected.id, item.id)
      .then (() => {
        console.log ("Elininado");
      })
      .catch (error => {
        console.log ("error", error);
      });
    } else {
      console.log ("Cancelar");
    }
  }

  editarSalida (item: any) {

  }

  getDateFormat (date: string) {
    return moment (date).format ('LL');
  }
}
