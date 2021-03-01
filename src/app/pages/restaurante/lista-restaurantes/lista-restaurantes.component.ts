import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';
import { RestauranteDatabaseService } from '../../../services/restaurante-database.service'; 
import { ExcelService } from '../../../services/excel.service';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'ngx-lista-restaurantes',
  templateUrl: './lista-restaurantes.component.html',
  styleUrls: ['./lista-restaurantes.component.scss']
})
export class ListaRestaurantesComponent implements OnInit {
  form: FormGroup;

  provincia_seleccionada: any;
  distrito_seleccionado: any;
  provincias: any [] = [];
  distritos: any [] = [];
  items: any [];
  _items: any [];
  
  contador: number = 0;
  
  clasificaciones: any [];
  categorias: any [];
  
  clasificacion_seleccionado: any = "";
  categoria_seleccionado: any = "";

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
              private rest_db: RestauranteDatabaseService,
              private excelService:ExcelService,
              private router: Router) { }

  ngOnInit() {
    this.provincias_cargando = true;
    
    this.subscribe_01 = this.database.getEstadisticasPorProvincias ().subscribe ((response: any []) => {
      this.provincias = response;
      console.log (response);

      this.provincias_cargando = false;
    });

    this.subscribe_01 = this.rest_db.getRestaurante_Clasificaciones ().subscribe ((response: any []) => {
      this.clasificaciones = response;
      console.log ('clasificaciones', response);
    });

    this.subscribe_02 = this.rest_db.getRestaurante_Categorias ().subscribe ((response: any []) => {
      this.categorias = response;
      console.log ('categorias', response);
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
      if (e ['total_restaurantes' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
        returned = e ['total_restaurantes' + this.year_seleccionado + this.mes_seleccionado];
      }

      contador += returned;
    });

    return contador;
  }

  get_contador_distritos () {
    let contador = 0;
    this.distritos.forEach ((e: any) => {
      let returned: number = 0;
      if (e ['total_restaurantes' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
        returned = e ['total_restaurantes' + this.year_seleccionado + this.mes_seleccionado];
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

    this.rest_db.getByProvincias (this.provincia_seleccionada.id).subscribe ((data: any []) => {
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

    this.rest_db.getByDistritos (this.distrito_seleccionado.id).subscribe ((data: any []) => {
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

    if (item ['total_restaurantes' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
      returned = item ['total_restaurantes' + this.year_seleccionado + this.mes_seleccionado];
    }

    return returned;
  }

  /* Estadisticas */

  filtrar () {
    console.log ("Cambio mrd");
    this.items = this._items;

    this.items = this.items.filter ((item: any) => {
      console.log (item);
      return this.check_clasificacion (item) && this.check_categoria (item);
    });

    this.contador = this.items.length;
  }

  check_clasificacion (item: any): boolean {
    if (this.clasificacion_seleccionado === "") {
      return true
    }

    return this.clasificacion_seleccionado === item.calificacion.id;
  }

  check_categoria (item: any): boolean {
    if (this.categoria_seleccionado === "") {
      return true
    }

    return this.categoria_seleccionado === item.categoria.id;
  }

  exportAsXLSX ():void {
    this.excelService.exportAsExcelFile(this.items, 'sample');
  }
}
