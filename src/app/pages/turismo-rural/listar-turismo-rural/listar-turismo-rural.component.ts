import { Component, OnInit, TemplateRef } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';
import { NbDialogService } from '@nebular/theme';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-listar-turismo-rural',
  templateUrl: './listar-turismo-rural.component.html',
  styleUrls: ['./listar-turismo-rural.component.scss']
})
export class ListarTurismoRuralComponent implements OnInit {
  items: any [];

  idioma_seleccionado: string = "es";
  item_seleccionado: any;
  constructor(private database:DatabaseService, 
              private router: Router,
              private dialogService: NbDialogService) { }

  ngOnInit() {
    this.database.getTurismoRural ().subscribe ((res: any []) => {
      this.items = res;

      console.log (res);
    });
  }

  elimninar (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log (item);
      this.database.deleteTRC (item.id)
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
    console.log (item);

    this.item_seleccionado = item;
    this.dialogService.open(dialog, { context: '' });
  }

  go_edit (ref: any) {
    if (this.item_seleccionado != null) {
      this.router.navigate(['/pages/turismo-rural/turismo-rural-detalle', this.item_seleccionado.id, this.idioma_seleccionado]);
    }

    this.close_dialog (ref);
  }

  close_dialog (ref: any) {
    ref.close ();

    this.item_seleccionado = null;
    this.idioma_seleccionado = "es";
  }
}
