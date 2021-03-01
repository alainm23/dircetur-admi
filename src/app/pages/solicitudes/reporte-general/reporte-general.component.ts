import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { VerDetalleSolicitudComponent } from '../../../dialogs/ver-detalle-solicitud/ver-detalle-solicitud.component';

@Component({
  selector: 'ngx-reporte-general',
  templateUrl: './reporte-general.component.html',
  styleUrls: ['./reporte-general.component.scss']
})
export class ReporteGeneralComponent implements OnInit {
is_loading: boolean = true;
form_filtro: FormGroup;
subscribe_01: any;
subscribe_02: any;
subscribe_03: any;
subscribe_04: any;
subscribe_05: any;
reportes: any [];
reportes_distritos: any [];
solicitudes: any [];
solicitudes_respaldo: any [];
asuntos: any [];
provincia_seleccionada: string;
distrito_seleccionado: string;
id_provincia_seleccionada: string;
id_distrito_seleccionado: string;
filtrar_asunto: string;
mostrar_view: string = "historial_principal";
ano_actual: any= moment().format('YYYY');;
mes_actual: any= moment().format('MM');;
ano: any [] = [
  {
    value: '2019',
  },
  {
    value: '2020',
  },
  {
    value: '2021',
  },
  {
    value: '2022',
  }
];
mes: any [] = [
  {
    value: '01',
    nombre: 'Enero',
  },
  {
    value: '02',
    nombre: 'Febrero',
  },
  {
    value: '03',
    nombre: 'Marzo',
  },
  {
    value: '04',
    nombre: 'Abril',
  },
  {
    value: '05',
    nombre: 'Mayo',
  },
  {
    value: '06',
    nombre: 'Junio',
  },
  {
    value: '07',
    nombre: 'Julio',
  },
  {
    value: '08',
    nombre: 'Agosto',
  },
  {
    value: '09',
    nombre: 'Septiembre',
  },
  {
    value: '10',
    nombre: 'Octubre',
  },
  {
    value: '11',
    nombre: 'Noviembre',
  },
  {
    value: '12',
    nombre: 'Diciembre',
  }
];
estados_solicitudes: any [] = [
  {
    value: 0,
    nombre: 'Solicitado',
  },
  {
    value: 1,
    nombre: 'Aprobado',
  },
  {
    value: 2,
    nombre: 'Entregado',
  },
  {
    value: 3,
    nombre: 'Rechazado',
  }
];
  constructor(public database: DatabaseService, 
              public toastrService: NbToastrService,
              private dialogService: NbDialogService) { }

  ngOnInit() {
    this.form_filtro = new FormGroup ({
      ano: new FormControl (this.ano_actual),
      mes: new FormControl (this.mes_actual),
      asunto: new FormControl ('Mostrar Todos')
    });
    this.EstadisticaHistorial ();

    this.subscribe_05 = this.database.getAsuntos ().subscribe ((res: any []) => {
      this.asuntos = res;
      console.log ('Todos los asuntos son=',this.asuntos);
    });
  
  }

  EstadisticaHistorial () {
    this.subscribe_01 = this.database.getEstadisticaSolicitudesProvincia ().subscribe ((response: any) => {
      console.log('Reportes', response);
      this.reportes = response;
      this.reportes.forEach(reporte => {
        
        if (reporte.datageneral!=undefined || reporte.datageneral!=null)
        {
          reporte.boton=false;
        }
        else
        {
          reporte.boton=true;
        }
        
      });
      this.is_loading=false;
    });
  }

  CambiarAno (ano:number) {
    this.ano_actual=ano;
  }

  CambiarMes (mes:number) {
    this.mes_actual=mes;
  }

  actualizarFiltroDataano (ano:number) {
    this.is_loading=true;
    this.ano_actual=ano;
   
    console.log('este es el nuevo mes actual',this.mes_actual,'este es el nuevo año actual',this.ano_actual);
    this.is_loading=false;
  }

  actualizarFiltroDatames (mes:number) {
    this.is_loading=true;
    this.mes_actual=mes;

    console.log('este es el nuevo mes actual',this.mes_actual,'este es el nuevo año actual',this.ano_actual);
    this.is_loading=false;
  }

  ProvinciaactualizarFiltroDataano (ano:number) {
    this.is_loading=true;
    this.ano_actual=ano;
    this.subscribe_02 = this.database.getSolicitudesXProvinciaAnoMes (this.id_provincia_seleccionada, this.ano_actual, this.mes_actual).subscribe ((data: any) => {
      console.log('Todas las solicitudes de la provincia seleccionada', data);
      this.solicitudes = data;
      this.solicitudes_respaldo = data;
      this.mostrar_view="historial_detalle_provincia";
      this.is_loading=false;
    });
  }

  ProvinciaactualizarFiltroDatames (mes:number) {
    this.is_loading=true;
    this.mes_actual=mes;
    this.subscribe_02 = this.database.getSolicitudesXProvinciaAnoMes (this.id_provincia_seleccionada, this.ano_actual, this.mes_actual).subscribe ((data: any) => {
      console.log('Todas las solicitudes de la provincia seleccionada', data);
      this.solicitudes = data;
      this.solicitudes_respaldo = data;
      this.mostrar_view="historial_detalle_provincia";
      this.is_loading=false;
    });
  }

  DistritoactualizarFiltroDataano (ano:number) {
    this.is_loading=true;
    this.ano_actual=ano;
    this.subscribe_03 = this.database.getSolicitudesXDistritosAnoMes (this.id_distrito_seleccionado, this.ano_actual, this.mes_actual).subscribe ((data2: any) => {
      console.log('Todas las solicitudes de la provincia seleccionada', data2);
      this.solicitudes = data2;
      this.solicitudes_respaldo = data2;
      this.mostrar_view="historial_detalle_solicitudes_distrito";
      this.is_loading=false;
    });
  }

  DistritoactualizarFiltroDatames (mes:number) {
    this.is_loading=true;
    this.mes_actual=mes;
    this.subscribe_03 = this.database.getSolicitudesXDistritosAnoMes (this.id_distrito_seleccionado, this.ano_actual, this.mes_actual).subscribe ((data2: any) => {
      console.log('Todas las solicitudes de la provincia seleccionada', data2);
      this.solicitudes = data2;
      this.solicitudes_respaldo = data2;
      this.mostrar_view="historial_detalle_solicitudes_distrito";
      this.is_loading=false;
    });
  }

  Formatear (dato:any, campo:string) 
  {

    let resultado:any = dato [campo+this.ano_actual+'_'+this.mes_actual];
    if (resultado==undefined || resultado==null)
    {
      return 0;
    }
    else
    {
      return resultado;
    }

  }

  FormatearCantidad (dato:any, campo:string)
  {
    let resultado:any = dato [campo+this.ano_actual+'_'+this.mes_actual];
    if (resultado==undefined || resultado==null)
    {
      return 0;
    }
    else
    {
      return resultado;
    }
    
  }

  detalleHistorial (item:any) {
    this.is_loading=true;
    this.id_provincia_seleccionada=item.id;
    this.provincia_seleccionada=item.nombre;
    this.subscribe_02 = this.database.getSolicitudesXProvinciaAnoMes (item.id, this.ano_actual, this.mes_actual).subscribe ((data: any) => {
      console.log('Todas las solicitudes de la provincia seleccionada', data);
      this.solicitudes = data;
      this.solicitudes_respaldo = data;
      this.mostrar_view="historial_detalle_provincia";
      this.is_loading=false;
    });
  }

  detalleHistorialDistrito (item:any) {
    this.is_loading=true;
    this.id_distrito_seleccionado=item.id;
    this.distrito_seleccionado=item.nombre;
    this.subscribe_03 = this.database.getSolicitudesXDistritosAnoMes (item.id, this.ano_actual, this.mes_actual).subscribe ((data2: any) => {
      console.log('Todas las solicitudes de la provincia seleccionada', data2);
      this.solicitudes = data2;
      this.solicitudes_respaldo = data2;
      this.mostrar_view="historial_detalle_solicitudes_distrito";
      this.is_loading=false;
    });
  }

  detalleProvincia (item: any) {
    this.is_loading=true;
    this.provincia_seleccionada=item.nombre;
    this.subscribe_04 = this.database.getEstadisticaSolicitudesDistritos (item.id).subscribe ((response: any) => {
      console.log('Reportes por Provincia', response);
      this.reportes_distritos = response;
      this.reportes_distritos.forEach(reporte => {
        
        if (reporte.datageneral!=undefined || reporte.datageneral!=null)
        {
          reporte.boton=false;
        }
        else
        {
          reporte.boton=true;
        }
        this.is_loading=false;
      });
      this.mostrar_view="historial_detalle_distritos";
    });
  }

  detalleSolicitud (data: any) {
    this.dialogService.open (VerDetalleSolicitudComponent, {
      context: {
        id: data.id,
      }
    });
  }

  formatFecha (fecha:any) {
    return moment(fecha).format('DD MMMM YYYY, h:mm:ss a');
  }

  Regresar () {
    this.mostrar_view="historial_principal";
  }

  filtrarXAsunto (item: any) {
    if (item=="Mostrar Todos")
    {
      this.solicitudes = this.solicitudes_respaldo;
    }
    else
    {
      this.solicitudes = this.solicitudes_respaldo;
      this.solicitudes = this.solicitudes.filter (solicitud => {
        return solicitud.asunto.id===item.id;
      });
    }
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

    if (this.subscribe_05 !== null && this.subscribe_05 !== undefined) {
      this.subscribe_05.unsubscribe ();
    }
  }

}
