import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';

import { DatabaseService } from '../../../services/database.service';
import { NbToastrService } from '@nebular/theme';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';
import { Observable } from "rxjs";
@Component({
  selector: 'ngx-funciones',
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.scss']
})
export class FuncionesComponent implements OnInit {
  items: any [] = [];
  form: FormGroup;

  show_nuevo: boolean = false;
  is_nuevo_loading: boolean = false;
  constructor(private toastrService: NbToastrService,
              private database: DatabaseService) { }

  ngOnInit() {
    this.form = new FormGroup ({
      funcion: new FormControl ('', [Validators.required]),
      descripcion: new FormControl ('', [Validators.required])
    });

    this.database.getFunciones ().subscribe ((res: any []) => {
      this.items = res;
    });
  }

  agregar () {
    this.show_nuevo = true;
  }

  cancelar_nuevo () {
    this.show_nuevo = false;
    this.is_nuevo_loading = false;

    this.form.reset ();
  }

  submit () {
    this.is_nuevo_loading = true;
    let data = this.form.value;

    this.database.addFuncion (data)
      .then (() => {
        this.cancelar_nuevo ();
        this.showToast ('top-right', 'El elemento se agrego con exito');
      })
      .catch ((error: any) => {

      });
  }

  eliminar (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      this.database.removeFuncion (item.id)
        .then (() => {
          this.showToast ('top-right', 'El elemento se elimino con exito');
        })
        .catch ((error: any) => {

        });
    } else {
      console.log ("Cancelar");
    }
  }

  actualizar (item: any) {
    console.log (item);
    this.database.updateFuncion (item)
      .then (() => {
        this.showToast ('top-right', 'El elemento se actualizo con exito');
      })
      .catch ((error) => {

      });
  }

  showToast (position, message: string) {
    this.toastrService.show(
      '',
      message,
      { position });
  }
}
