import { Component, OnInit } from '@angular/core';

// Services
import { AgenciaDatabaseService } from '../../../services/agencia-database.service';

@Component({
  selector: 'ngx-editar-tipos-turismo',
  templateUrl: './editar-tipos-turismo.component.html',
  styleUrls: ['./editar-tipos-turismo.component.scss']
})
export class EditarTiposTurismoComponent implements OnInit {
  subscribe_01: any;
  items: any [] = [];
  is_loading: boolean = true;
  show_nuevo: boolean = false;
  is_nuevo_loading: boolean = false;
  nuevo: string = "";
  constructor(private agencia_db: AgenciaDatabaseService) { }

  ngOnInit() {
    this.subscribe_01 = this.agencia_db.getModalidad_Turismo ().subscribe ((response: any []) => {
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
      this.agencia_db.removeModalidad_Turismo (item);
    } else {
      console.log ("Cancelar");
    }
  }

  editar (item: any) {
    item.checked = true;
  }

  cancel (item: any) {
    item.checked = false;
  }

  guardar (item: any) {
    let nombre = (<HTMLInputElement> document.getElementById(item.id)).value;
    
    if (nombre !== "") {
      item.nombre = nombre;

      this.agencia_db.updateModalidad_Turismo (item)
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
      this.agencia_db.addModalidad_Turismo (this.nuevo)
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
