import { Component, OnInit, TemplateRef } from '@angular/core';

// Services
import { NbDialogService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-listar-circuitos',
  templateUrl: './listar-circuitos.component.html',
  styleUrls: ['./listar-circuitos.component.scss']
})
export class ListarCircuitosComponent implements OnInit {
  items: any [];

  idioma_seleccionado: string = "es";
  item_seleccionado: any;
  constructor(private database:DatabaseService, 
              private router: Router,
              private dialogService: NbDialogService) { }

  ngOnInit() {
    this.database.getCircuitos ().subscribe ((res) => {
      this.items = res;
    });
  }

  elimninar (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log (item);
      this.database.deleteCircuito (item.id)
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

  editar (item: any, dialog: TemplateRef<any>) {
    this.item_seleccionado = item;
    this.dialogService.open(dialog, { context: '' });
    //
  }

  go_edit (ref: any) {
    if (this.item_seleccionado != null) {
      this.router.navigate(['/pages/circuito-turistico/circuito-detalle', this.item_seleccionado.id, this.idioma_seleccionado]);
    }

    this.close_dialog (ref);
  }

  close_dialog (ref: any) {
    ref.close ();

    this.item_seleccionado = null;
    this.idioma_seleccionado = "es";
  }

  get_data (data: any) {
    if (data ['nombre_es'] != null && data ['nombre_es'] !== undefined && data ['nombre_es'] !== '') {
      return data ['nombre_es'];
    }

    return data ['nombre'];
  }
}
