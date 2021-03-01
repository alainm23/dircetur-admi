import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../../services/database.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'ngx-listar-asuntos',
  templateUrl: './listar-asuntos.component.html',
  styleUrls: ['./listar-asuntos.component.scss']
})
export class ListarAsuntosComponent implements OnInit {
items: any [];
item_seleccionado: any;
  constructor(public database: DatabaseService, 
              private router: Router) { }

  ngOnInit() {
    this.database.getAsuntos ().subscribe ((res: any []) => {
      this.items = res;
      console.log (res);
    });
  }

  elimninar (item: any) {
    var opcion = confirm("¿Esta usted seguro que desea eliminar esta información?");
    if (opcion == true) {
      console.log (item);
      this.database.removeAsuntos (item)
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
  agregarAsunto () {
    this.router.navigate(['/pages/asuntos/agregar-asunto']);
  }
  editar (item: any) {
    this.item_seleccionado = item;
    this.router.navigate(['/pages/asuntos/asunto-detalle/',this.item_seleccionado.id]);
  }

}
