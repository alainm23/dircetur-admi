import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';
import { GuiaDatabaseService } from '../../../services/guia-database.service';
import { ExcelService } from '../../../services/excel.service';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'ngx-lista-guias',
  templateUrl: './lista-guias.component.html',
  styleUrls: ['./lista-guias.component.scss']
})
export class ListaGuiasComponent implements OnInit {
  form: FormGroup;

  provincia_seleccionada: any;
  distrito_seleccionado: any;
  provincias: any [] = [];
  distritos: any [] = [];
  items: any [];
  _items: any [];
  
  contador: number = 0;
  
  idiomas: any [];
  tipos: any [];
  centro_formacion: any [];
  asociacion_colegio: any [];
  
  idioma_seleccionado: any = "";
  tipo_seleccionado: any = "";
  centro_seleccionado: any = ""
  asociacion_seleccionado: any = ""

  subscribe_01: any;
  subscribe_02: any;
  subscribe_03: any;

  view: string = "provincias";
  year_seleccionado: string = moment ().format ('[_]YYYY');
  mes_seleccionado: string = moment ().format ('[_]MM');

  provincias_cargando: boolean = false;
  distritos_cargando: boolean = false;
  lista_cargando: boolean = false;
  constructor(private database: DatabaseService,
              private guia_db: GuiaDatabaseService,
              private excelService:ExcelService,
              private router: Router) { }

  ngOnInit() {
    this.provincias_cargando = true;
    
    this.subscribe_01 = this.database.getEstadisticasPorProvincias ().subscribe ((response: any []) => {
      this.provincias = response;
      console.log (response);

      this.provincias_cargando = false;
    });

    this.guia_db.getGuia_Idiomas ().subscribe ((data) => {
      this.idiomas = data;
    }); 

    this.guia_db.getGuia_Tipo_Guiado ().subscribe ((data) => {
      this.tipos = data;
    }); 
    
    this.guia_db.getGuia_Centro_Formacion ().subscribe ((res: any []) => {
      this.centro_formacion = res;
    });

    this.guia_db.getGuia_Asociacion_Colegio ().subscribe ((res: any []) => {
      this.asociacion_colegio = res;
    });
  }

  ngOnDestroy () {
    if (this.subscribe_01 !== null && this.subscribe_01 !== undefined) {
      this.subscribe_01.unsubscribe ();
    }

    if (this.subscribe_02 !== null && this.subscribe_02 !== undefined) {
      this.subscribe_02.unsubscribe ();
    }

    if (this.subscribe_03 !== null && this.subscribe_03 !== undefined) {
      this.subscribe_03.unsubscribe ();
    }
  }

  get_total_provincias () {
    let contador = 0;
    this.provincias.forEach ((e: any) => {
      let returned: number = 0;
      if (e ['total_guias' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
        returned = e ['total_guias' + this.year_seleccionado + this.mes_seleccionado];
      }

      contador += returned;
    }); 

    return contador;
  }

  get_contador_distritos () {
    let contador = 0;
    this.distritos.forEach ((e: any) => {
      let returned: number = 0;
      if (e ['total_guias' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
        returned = e ['total_guias' + this.year_seleccionado + this.mes_seleccionado];
      }

      contador += returned;
    }); 

    return contador;
  }

  ver_distritos (item: any) {
    this.provincia_seleccionada = item;
    this.ir_vista ('distritos');
    this.distritos_cargando = true;

    console.log ('provincia_seleccionada', this.provincia_seleccionada);

    this.database.getEstadisticasPorDistrito (this.provincia_seleccionada.id).subscribe ((res: any []) => {
      this.distritos = res;
      this.distritos_cargando = false;
    });
  }

  get_items_por_provincia (item: any) {
    this.provincia_seleccionada = item;
    this.ir_vista ('lista');
    this.lista_cargando = true;

    console.log ()

    this.guia_db.getByProvincias (this.provincia_seleccionada.id).subscribe ((data: any []) => {
        console.log (data);
        
        this._items = data;
        this.items = data;
        
        this.contador = data.length;

        this.lista_cargando = false;
    });
  }
  
  get_items_por_distrito (item: any) {
    this.distrito_seleccionado = item;
    this.ir_vista ('lista');
    this.lista_cargando = true;

    console.log ('distrito_seleccionado', this.distrito_seleccionado);

    this.guia_db.getByDistritos (this.distrito_seleccionado.id).subscribe ((data: any []) => {
        console.log (data);

        this._items = data;
        this.items = data;
        
        this.contador = data.length;

        this.lista_cargando = false;
    });
  }

  ir_vista (view: string) {
    this.view = view;
  }

  year_changed () {
    if (this.year_seleccionado === '') {
      this.mes_seleccionado = '';
    }
  }

  get_cantidad (item: any) {
    let returned: number = 0;

    if (item ['total_guias' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
      returned = item ['total_guias' + this.year_seleccionado + this.mes_seleccionado];
    }

    return returned;
  }

  /* Estadisticas */

  filtrar () {
    console.log ("Cambio mrd");
    this.items = this._items;

    this.items = this.items.filter ((item: any) => {
      console.log (item);
      return this.check_1 (item) && this.check_2 (item) && this.check_3 (item) && this.check_4 (item);
    });

    this.contador = this.items.length;
  }

  check_1 (item: any): boolean {
    if (this.centro_seleccionado === "") {
      return true
    }

    return this.centro_seleccionado === item.centro_formacion.id;
  }

  check_2 (item: any): boolean {
    if (this.asociacion_seleccionado === "") {
      return true
    }

    return this.asociacion_seleccionado === item.asociacion_colegio.id;
  }

  check_3 (item: any): boolean {
    if (this.idioma_seleccionado === "") {
      return true
    }

    const found = item.idioma.find ((element: any) => {
      return element.id === this.idioma_seleccionado;
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  check_4 (item: any): boolean {
    if (this.tipo_seleccionado === "") {
      return true
    }

    const found = item.tipo_guiado.find ((element: any) => {
      return element.id === this.tipo_seleccionado;
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  exportAsXLSX ():void {
    this.excelService.exportAsExcelFile(this.items, 'sample');
  }
}
