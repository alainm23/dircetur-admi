import { Component, OnInit } from '@angular/core';

// Services
import { AgenciaDatabaseService } from '../../../services/agencia-database.service';

@Component({
  selector: 'ngx-editar-clasificacion',
  templateUrl: './editar-clasificacion.component.html',
  styleUrls: ['./editar-clasificacion.component.scss']
})
export class EditarClasificacionComponent implements OnInit {
  subscribe_01: any;
  items: any [] = [];
  is_loading: boolean = true;
  show_nuevo: boolean = false;
  is_nuevo_loading: boolean = false;
  nuevo: string = "";
  constructor(private agencia_db: AgenciaDatabaseService) { }

  ngOnInit() {
    this.subscribe_01 = this.agencia_db.getAgenciaTipo_Clasificaciones ().subscribe ((response: any []) => {
      this.items = response.reverse ();
      this.is_loading = false;
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
      this.agencia_db.removeAgenciaTipo_Clasificaciones (item);
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
    
    if (name !== "") {
      item.nombre = nombre;

      this.agencia_db.updateAgenciaTipo_Clasificaciones (item)
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
      this.agencia_db.addAgenciaTipo_Clasificaciones (this.nuevo)
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
