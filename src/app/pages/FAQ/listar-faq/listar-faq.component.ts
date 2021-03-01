import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';

import { DatabaseService } from '../../../services/database.service';
import { NbToastrService } from '@nebular/theme';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';
import { Observable } from "rxjs";

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'ngx-listar-faq',
  templateUrl: './listar-faq.component.html',
  styleUrls: ['./listar-faq.component.scss']
})
export class ListarFAQComponent implements OnInit {
  categoria_selected: any = {
    id: '',
    nombre: ''
  };

  categorias: any [] = [];

  items: any[] = [];
  show_nuevo: boolean = false;
  is_nuevo_loading: boolean = false;
  is_loading: boolean = false;
  form: FormGroup;

  public Editor = ClassicEditor;
  
  config: any = {
    fillEmptyBlocks: false,
    tabSpaces: 0
  };
  constructor(private toastrService: NbToastrService,
              private database: DatabaseService) { }

  ngOnInit() {
    this.form = new FormGroup ({
      pregunta: new FormControl ('', [Validators.required]),
      respuesta: new FormControl ('', [Validators.required])
    });

    this.is_loading = true;

    this.database.getFAQCategorias ().subscribe ((res: any []) => {
      if (res.length > 0) {
        this.categoria_selected = res [0];
        this.is_loading = false;

        this.database.getFAQs (this.categoria_selected.id).subscribe ((res) => {
          this.items = res;
        });
      }

      console.log (res);
      this.categorias = res;
    });
  }

  submit () {
    if (this.categoria_selected !== null || this.categoria_selected !== undefined) {
      this.is_loading = true;

      this.database.getFAQs (this.categoria_selected.id).subscribe ((res) => {
        this.items = res;
        this.is_loading = false;
      });
    }
  }

  agregar_submit () {
    this.is_nuevo_loading = true;
    let data = this.form.value;

    this.database.addFAQ (data, this.categoria_selected)
      .then (() => {
        this.cancelar_nuevo ();
        this.showToast ('top-right', 'El elemento se agrego con exito');
      })
      .catch ((error: any) => {

      });
  }

  agregar_nuevo () {
    this.show_nuevo = true;
  }

  cancelar_nuevo () {
    this.show_nuevo = false;
    this.is_nuevo_loading = false;

    this.form.reset ();
  }

  showToast (position, message: string) {
    this.toastrService.show(
      '',
      message,
      { position });
  }

  eliminar (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      this.database.removeFAQ (item.id, this.categoria_selected)
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
    this.database.updateFAQ (item, this.categoria_selected)
      .then (() => {
        this.showToast ('top-right', 'El elemento se actualizo con exito');
      })
      .catch ((error) => {

      });
  }
}
