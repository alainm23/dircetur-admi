import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';
@Component({
  selector: 'ngx-editar-etiquetas',
  templateUrl: './editar-etiquetas.component.html',
  styleUrls: ['./editar-etiquetas.component.scss']
})
export class EditarEtiquetasComponent implements OnInit {
  subscribe_01: any;
  items: any [] = [];
  is_loading: boolean = true;
  show_nuevo: boolean = false;
  is_nuevo_loading: boolean = false;
  nuevo: string = "";
  constructor(private database: DatabaseService,) { }

  ngOnInit() {
    this.subscribe_01 = this.database.getBlog_Categorias ().subscribe ((response: any []) => {
      this.items = response.reverse ();
      this.is_loading = false;

      console.log (this.items);
    });
  }

  ngOnDestroy () {
    if (this.subscribe_01 !== null && this.subscribe_01 !== undefined) {
      this.subscribe_01.unsubscribe ();
    }
  }

  eliminar (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      this.database.removeBlog_Categorias (item);
    } else {
      console.log ("Cancelar");
    }
  }

  editar (item: any) {
    item.edit = true;
  }

  cancel (item: any) {
    item.edit = false;
  }

  guardar (item: any) {
    let nombre = (<HTMLInputElement> document.getElementById(item.id)).value;
    
    if (nombre !== "") {
      item.nombre = nombre;

      this.database.updateBlog_Categorias (item)
        .then (() => {
          console.log ("Actualizado");
          item.edit = false;
        })
        .catch ((error) => {
          console.log ("error", error);
          item.edit = false;
        });
    } else {
    }
  }

  cancel_nuevo () {
    this.show_nuevo = false;
    this.nuevo = "";
  }

  guardar_nuevo () {
    if (this.nuevo != "") {
      this.is_nuevo_loading = true;
      this.database.addBlog_Categorias (this.nuevo)
        .then (() => {
          this.nuevo = "";
          this.show_nuevo = false;
          this.is_nuevo_loading = false;
        })
        .catch (error => {

        });
    } else {

    }
  }

  agregar_nuevo () {
    this.show_nuevo = true;
  }
}
