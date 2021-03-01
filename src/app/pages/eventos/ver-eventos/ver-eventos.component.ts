import { Component, OnInit, TemplateRef } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';

import { NbDialogService } from '@nebular/theme';

import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'ngx-ver-eventos',
  templateUrl: './ver-eventos.component.html',
  styleUrls: ['./ver-eventos.component.scss']
})
export class VerEventosComponent implements OnInit {
  messelected: any = {
    mes: "Enero",
    value: "01"
  };

  meses: any[] = [
    {
      mes: "Enero",
      value: "01"
    }, 
    {
      mes: "Febrero",
      value: "02"
    }, 
    {
      mes: "Marzo",
      value: "03"
    }, 
    {
      mes: "Abril",
      value: "04"
    }, 
    {
      mes: "Mayo",
      value: "05"
    }, 
    {
      mes: "Junio",
      value: "06"
    }, 
    {
      mes: "Julio",
      value: "07"
    }, 
    {
      mes: "Agosto",
      value: "08"
    }, 
    {
      mes: "Septiembre",
      value: "09"
    }, 
    {
      mes: "Octubre",
      value: "10"
    }, 
    {
      mes: "Noviembre",
      value: "11"
    }, 
    {
      mes: "Diciembre",
      value: "12"
    }
  ];

  items: any[];

  idioma_seleccionado: string = "es";
  item_seleccionado: any;
  constructor(public database: DatabaseService,
              private router: Router,
              private dialogService: NbDialogService) { }

  ngOnInit() {
  }

  ngOnDestroy () {

  }

  elimninar (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log (item);
      this.database.deleteEvento (item.ref)
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

  submit () {
    console.log (this.messelected);

    this.database.getEventosMes (this.messelected.value).subscribe ((data: any []) => {
      console.log (data);

      this.items = data.sort ((a: any, b: any) => {

        var date1 = new Date (a.ref.fecha.substring (0, 10));
        var date2 = new Date (b.ref.fecha.substring (0, 10));

        return date1.getTime () - date2.getTime ();
      });

      console.log (this.items);
    });
  }

  go_edit (ref: any) {
    if (this.item_seleccionado != null) {
      this.router.navigate(['/pages/eventos/evento-detalle/' + this.item_seleccionado.id + "/" +this.idioma_seleccionado]);
    }

    this.close_dialog (ref);
  }

  close_dialog (ref: any) {
    ref.close ();

    this.item_seleccionado = null;
    this.idioma_seleccionado = "es";
  }

  get_data (data: any) {
    if (data ['titulo_es'] != null && data ['titulo_es'] !== undefined && data ['titulo_es'] !== '') {
      return data ['titulo_es'];
    }

    return data ['titulo'];
  }

  get_fecha (item: any) {
    return moment (item.fecha.substring (0, 10)).format ("DD");
  }
}
