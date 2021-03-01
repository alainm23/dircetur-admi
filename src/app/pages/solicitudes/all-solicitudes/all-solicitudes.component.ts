import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { Router } from '@angular/router'; 
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
@Component({
  selector: 'ngx-all-solicitudes',
  templateUrl: './all-solicitudes.component.html',
  styleUrls: ['./all-solicitudes.component.scss']
})
export class AllSolicitudesComponent implements OnInit {
form: FormGroup;
form2: FormGroup;
form3: FormGroup;
form4: FormGroup;
capacitaciones: any [];
items: any [];
item_seleccionado: any;
provincias: any [];
distritos: any [];
esta_distritos_cargando: boolean = true;
resultados_solicitudes: boolean = false;
subscribe_01: any;
subscribe_02: any;
subscribe_03: any;
subscribe_04: any;
estado_solicitud: any;
tipo_filtro: number = 0;
acum_montos_aprobados: number = 0;
estados_solicitudes: any [] = [
  {
    value: 0,
    nombre: 'Solicitud',
  },
  {
    value: 1,
    nombre: 'Aprobados',
  },
  {
    value: 2,
    nombre: 'Rechazados',
  }
];
  constructor(public database: DatabaseService, 
              public toastrService: NbToastrService,
              private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup ({
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required)
    });

    this.form2 = new FormGroup ({
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      estado: new FormControl ('', Validators.required)
    });

    this.form3 = new FormGroup ({
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      capacitacion: new FormControl ('', Validators.required)
    });

    this.form4 = new FormGroup ({
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      capacitacion: new FormControl ('', Validators.required),
      estado: new FormControl ('', Validators.required)
    });
    
    this.subscribe_01 = this.database.getProvincias ().subscribe ((response: any []) => {
      this.provincias = response;
    });

    this.subscribe_04 = this.database.getCapacitaciones ().subscribe ((response: any []) => {
      this.capacitaciones = response;
    });

  }

  provinciaChanged (event: any) {
    this.esta_distritos_cargando = true;
    console.log (event);
    this.subscribe_02 = this.database.getDistritosByProvincias (event.id).subscribe ((response: any []) => {
      this.distritos = response;
      this.esta_distritos_cargando = false;
    }, (error: any) => {
      console.log ('getDistritosByProvincias', error);
      this.esta_distritos_cargando = true;
    });
  }

  getData (item: any) {
    if (item.estado==0){
      this.estado_solicitud='Solicitado'; 
    } else if (item.estado==1){
      this.estado_solicitud='Aprobado';
    } else if (item.estado==2){
      this.estado_solicitud='Rechazado';
    }
    return 'Apellido: ' + item.apellido + ' - ' + 'Número de Documento: ' + item.n_doc + ' - ' + 'Tipo de Capacitación: ' + item.capacitacion.nombre + ' - ' + /*'Asunto: ' + item.asunto.nombre + ' - ' +*/ 'Monto: ' + item.monto + ' - ' + 'Fecha de Solicitud: ' + item.fecha_solicitud + /*' - ' + 'Fecha de Cambio de Estado: ' + item.fecha_cambio + ' - ' +*/ 'Estado: ' + this.estado_solicitud;
  }

  tipoFiltro (tipo:number) {
    if(tipo==1){
      this.tipo_filtro=1;
    }
    else if(tipo==2)
    {
      this.tipo_filtro=2;
    }
    else if(tipo==3)
    {
      this.tipo_filtro=3;
    }
    else if(tipo==4)
    {
      this.tipo_filtro=4;
    }
  }

  submit () {
    this.acum_montos_aprobados=0;
    if (this.tipo_filtro==1)
    {
      this.database.getSolicitudesByDistritos (this.form.value.provincia.id, this.form.value.distrito.id)
      .subscribe ((data: any []) => {
        if (data==null || data==undefined)
        {
          this.resultados_solicitudes=false;
        }
        else
        {
          this.resultados_solicitudes=true;
          console.log ('Resultado de la busqueda=',data);
          this.items = data;
          data.forEach(item => {
            console.log('detalle del foreach=',item);
            if (item.estado==1)
            {
              console.log('Entre en la condición HOLA');
              this.acum_montos_aprobados+=item.monto;
            }
          });
        }
      });
    }
    else if (this.tipo_filtro==2)
    {
      this.database.getSolicitudesByDistritosAndEstado (this.form2.value.provincia.id, this.form2.value.distrito.id, this.form2.value.estado)
      .subscribe ((data: any []) => {
        if (data==null || data==undefined)
        {
          this.resultados_solicitudes=false;
        }
        else
        {
          this.resultados_solicitudes=true;
          console.log ('Resultado de la busqueda=',data);
          this.items = data;
          data.forEach(item => {
            console.log('detalle del foreach=',item);
            if (item.estado==1)
            {
              console.log('Entre en la condición HOLA');
              this.acum_montos_aprobados+=item.monto;
            }
          });
        }
      });
    }
    else if (this.tipo_filtro==3)
    {
      this.database.getSolicitudesByDistritosAndTipo (this.form3.value.provincia.id, this.form3.value.distrito.id, this.form3.value.capacitacion.id)
      .subscribe ((data: any []) => {
        if (data==null || data==undefined)
        {
          this.resultados_solicitudes=false;
        }
        else
        {
          this.resultados_solicitudes=true;
          console.log ('Resultado de la busqueda=',data);
          this.items = data;
          data.forEach(item => {
            console.log('detalle del foreach=',item);
            if (item.estado===1)
            {
              console.log('Entre en la condición HOLA');
              this.acum_montos_aprobados+=item.monto;
            }
          });
        }
      });
    }
    else if (this.tipo_filtro==4)
    {
      this.database.getSolicitudesByDistritosAndEstadoAndTipo (this.form4.value.provincia.id, this.form4.value.distrito.id, this.form4.value.estado, this.form4.value.capacitacion.id)
      .subscribe ((data: any []) => {
        if (data==null || data==undefined)
        {
          this.resultados_solicitudes=false;
        }
        else
        {
          this.resultados_solicitudes=true;
          console.log ('Resultado de la busqueda=',data);
          this.items = data;
          data.forEach(item => {
            console.log('detalle del foreach=',item);
            if (item.estado==1)
            {
              console.log('Entre en la condición HOLA');
              this.acum_montos_aprobados+=item.monto;
            }
          });
        }
      });
    }
  }

  estado (item: any, estado: number) {
    this.acum_montos_aprobados=0;
    
    this.database.updateEstadoSolicitud (item, estado)
    .then (() => {
      this.showToast ('top-right');
    }).catch ((error: any) => {
      console.log ("Error", error);
    });

    this.items.forEach(item => {
      console.log('detalle del foreach=',item);
      if (item.estado===1)
      {
        console.log('Entre en la condición HOLA');
        this.acum_montos_aprobados+=item.monto;
      }
    });
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'Estado cambiado con éxito.',
      { position });
  }

  verDetalle (item: any) {
    this.item_seleccionado = item;
    this.router.navigate(['/pages/solicitudes/solicitud-detalle/',this.item_seleccionado.id]);
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

    if (this.subscribe_04 !== null && this.subscribe_04 !== undefined) {
      this.subscribe_04.unsubscribe ();
    }
  }
}
