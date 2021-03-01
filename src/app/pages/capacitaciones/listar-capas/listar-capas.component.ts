import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../../services/database.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'ngx-listar-capas',
  templateUrl: './listar-capas.component.html',
  styleUrls: ['./listar-capas.component.scss']
})
export class ListarCapasComponent implements OnInit {
items: any [];
item_seleccionado: any;
  constructor(public database: DatabaseService, 
              private router: Router) { }

  ngOnInit() {
    this.database.getCapacitaciones ().subscribe ((res: any []) => {
      this.items = res;
      console.log (res);
    });
  }

  agregarCapacitacion () {
    this.router.navigate(['/pages/capacitaciones/agregar-capa']);
  }

  elimninar (item: any) {
    var opcion = confirm("¿Esta usted seguro que desea eliminar esta información?");
    if (opcion == true) {
      console.log (item);
      this.database.removeCapacitaciones (item)
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
    this.item_seleccionado = item;
    this.router.navigate(['/pages/capacitaciones/capa-detalle/',this.item_seleccionado.id]);
  }

}
