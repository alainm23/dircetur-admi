import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'ngx-editar-categorias',
  templateUrl: './editar-categorias.component.html',
  styleUrls: ['./editar-categorias.component.scss']
})
export class EditarCategoriasComponent implements OnInit {
  subscribe_01: any;
  items: any [] = [];
  is_loading: boolean = true;
  show_nuevo: boolean = false;
  is_nuevo_loading: boolean = false;
  nuevo: string = "";

  view: string = 'categorias'
  categoria_seleccionada: any = null;
  subcategorias: any [] = [];
  show_nuevo_subcategoria: boolean = false;
  nuevo_subcategoria: string = '';
  is_nuevo_sub_loading: boolean = false;
  
  constructor(private database: DatabaseService) { }

  ngOnInit() {
    this.subscribe_01 = this.database.getTransparenciaCategorias ().subscribe ((response: any []) => {
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
      this.database.removeTransparenciaCategoria (item);
    } else {
      console.log ("Cancelar");
    }
  }

  eliminar_sub (item: any) {
    var opcion = confirm("Eliminar?");

    console.log (this.categoria_seleccionada);
    console.log (item);

    if (opcion == true && this.categoria_seleccionada !== null) {
      this.database.removeTransparenciaSubCategoria (this.categoria_seleccionada.id, item)
        .then (() => {

        })
        .catch ((error: any) => {

        });
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

  regresar_vista_categorias () {
    this.view = 'categorias';
    this.categoria_seleccionada = null;
    this.subcategorias = [];
  }

  guardar (item: any) {
    let name = (<HTMLInputElement> document.getElementById (item.id)).value;
    
    if (name !== "") {
      item.nombre = name;

      this.database.updateTransparenciaCategoria (item)
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

  guardar_sub (item: any) {
    let name = (<HTMLInputElement> document.getElementById (item.id)).value;
    
    if (name !== "" && this.categoria_seleccionada !== null) {
      item.nombre = name;

      this.database.updateTransparenciaSubCategoria (this.categoria_seleccionada.id, item)
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
      this.database.addTransparenciaCategoria (this.nuevo)
        .then (() => {
          this.nuevo = "";
          this.show_nuevo = false;
          this.is_nuevo_loading = false;
        })
        .catch (error => {

        });
    }
  }

  cancel_nuevo_sub () {
    this.show_nuevo_subcategoria = false;
    this.nuevo_subcategoria = '';
  }

  guardar_nuevo_subcategoria () {
    if (this.nuevo_subcategoria != "") {
      this.is_nuevo_sub_loading = true;
      this.database.addTransparenciaSubcategoria (this.categoria_seleccionada.id, this.nuevo_subcategoria)
        .then (() => {
          this.nuevo_subcategoria = "";
          this.show_nuevo_subcategoria = false;
          this.is_nuevo_sub_loading = false;
        })
        .catch (error => {

        });
    }
  }

  agregar_nuevo () {
    this.show_nuevo = true;
  }
  
  ver_subcategorias (item: any) {
    this.view = 'subcategorias';
    this.categoria_seleccionada = item;

    this.database.getTransparenciaSubCategorias (item.id).subscribe ((res: any []) => {
      this.subcategorias = res;
      console.log (res);
    });
  }
}