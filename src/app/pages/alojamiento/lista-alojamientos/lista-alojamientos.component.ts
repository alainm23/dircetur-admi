import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';
import { AlojamientoDatabaseService } from '../../../services/alojamiento-database.service';
import { AgenciaDatabaseService } from '../../../services/agencia-database.service';
import { ExcelService } from '../../../services/excel.service';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as moment from 'moment';
import { NbDialogService } from '@nebular/theme';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-lista-alojamientos',
  templateUrl: './lista-alojamientos.component.html',
  styleUrls: ['./lista-alojamientos.component.scss']
})
export class ListaAlojamientosComponent implements OnInit {
  provincia_seleccionada: any;
  distrito_seleccionado: any;
  provincias: any [] = [];
  distritos: any [] = [];
  para_revisar: any [] = [];
  items: any [];
  _items: any [];
  
  contador: number = 0;
  is_upload: boolean = false;
  
  tipo_clasificaciones: any [];
  modalidad_turismo: any [];
  tipos_turismo: any [];
  
  clasificacion_seleccionado: any = "";
  modalidad_seleccionado: any = "";
  tipo_seleccionado: any = ""

  subscribe_01: any;
  subscribe_02: any;
  subscribe_03: any;

  view: string = "provincias";
  year_seleccionado: string = moment ().format ('[_]YYYY');
  mes_seleccionado: string = moment ().format ('[_]MM');

  provincias_cargando: boolean = false;
  distritos_cargando: boolean = false;
  lista_cargando: boolean = false;
  descarga_cargando: boolean = false;

  tipo_para_revisar: string = 'todo';

  disabled_form: boolean = true;
  search_text: string = '';
  constructor(private database: DatabaseService,
              private alojamiento_db: AlojamientoDatabaseService,
              private agencia_db: AgenciaDatabaseService,
              private dialog: NbDialogService,
              private excelService:ExcelService,
              private toastrService: NbToastrService,
              private router: Router) { }

  ngOnInit() {
    this.provincias_cargando = true;
    
    this.subscribe_01 = this.database.getEstadisticasPorProvincias ().subscribe ((response: any []) => {
      this.provincias = response;
      this.provincias_cargando = false;
    });

    this.alojamiento_db.getHotelTipo_Clasificaciones ().subscribe ((response: any []) => {
      this.tipo_clasificaciones = response;
    });

    this.alojamiento_db.get_alojamientos_para_revisar ().subscribe ((res: any []) => {
      this.para_revisar = res.sort ((a: any, b: any) => {
        return new Date (b.fecha_solicitud).getTime () - new Date (a.fecha_solicitud).getTime ();
      });
      this.get_duplicados ();
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
      if (e ['total_alojamientos' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
        returned = e ['total_alojamientos' + this.year_seleccionado + this.mes_seleccionado];
      }

      contador += returned;
    });

    return contador;
  }

  get_contador_distritos () {
    let contador = 0;
    this.distritos.forEach ((e: any) => {
      let returned: number = 0;
      if (e ['total_alojamientos' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
        returned = e ['total_alojamientos' + this.year_seleccionado + this.mes_seleccionado];
      }

      contador += returned;
    });

    return contador;
  }

  ver_distritos (item: any) {
    this.provincia_seleccionada = item;
    this.ir_vista ('distritos');
    this.distritos_cargando = true;

    this.database.getEstadisticasPorDistrito (this.provincia_seleccionada.id).subscribe ((res: any []) => {
      this.distritos = res;
      this.distritos_cargando = false;
    });
  }

  get_items_por_provincia (item: any) {
    this.provincia_seleccionada = item;
    this.ir_vista ('lista');
    this.lista_cargando = true;

    console.log (this.year_seleccionado);
    console.log (this.mes_seleccionado);

    this.alojamiento_db.getByProvincias (this.provincia_seleccionada.id).subscribe ((data: any []) => {
      console.log (data);

      this._items = data.sort ((a: any,b: any) => {
        return moment (a.fecha_aprobado, "DD/MM/YYYY").diff (moment (b.fecha_aprobado, "DD/MM/YYYY"));
      }).reverse ();
      this.items = data.sort ((a: any,b: any) => {
        return moment (a.fecha_aprobado, "DD/MM/YYYY").diff (moment (b.fecha_aprobado, "DD/MM/YYYY"));
      }).reverse ();
      
      this.contador = data.length;
      this.lista_cargando = false;
    });
  }
  
  get_items_por_distrito (item: any) {
    this.distrito_seleccionado = item;
    this.ir_vista ('lista');
    this.lista_cargando = true;

    this.alojamiento_db.getByDistritos (this.distrito_seleccionado.id).subscribe ((data: any []) => {
      this._items = data.sort ((a: any,b: any) => {
        return moment (a.fecha_aprobado, "DD/MM/YYYY").diff (moment (b.fecha_aprobado, "DD/MM/YYYY"));
      }).reverse ();
      this.items = data.sort ((a: any,b: any) => {
        return moment (a.fecha_aprobado, "DD/MM/YYYY").diff (moment (b.fecha_aprobado, "DD/MM/YYYY"));
      }).reverse ();
      
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

    if (item ['total_alojamientos' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
      returned = item ['total_alojamientos' + this.year_seleccionado + this.mes_seleccionado];
    }

    return returned;
  }

  /* Estadisticas */

  filtrar () {
    this.items = this._items;

    this.items = this.items.filter ((item: any) => {
      return this.check_clasificacion (item);
    });

    this.contador = this.items.length;
  }

  check_clasificacion (item: any): boolean {
    if (this.clasificacion_seleccionado === "") {
      return true
    }

    return this.clasificacion_seleccionado === item.clase.id;
  }

  check_modalidad (item: any): boolean {
    if (this.modalidad_seleccionado === "") {
      return true
    }

    const found = item.modalidad_turismo.find ((element: any) => {
      return element.id === this.modalidad_seleccionado;
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  check_tipo (item: any): boolean {
    if (this.tipo_seleccionado === "") {
      return true
    }

    const found = item.tipos_turismo.find ((element: any) => {
      return element.id === this.tipo_seleccionado;
    });

    if (found === undefined) {
      return false;
    }

    return true;
  }

  exportAsXLSX ():void {
    let list: any [] = [];
    this.items.forEach ((e: any) => {
      let personal: string = '';
      e.personal.forEach ((p: any) => {
        personal += (Number (moment ().format ('YYYY')) - Number (moment (p.anio_nacimiento).format ('YYYY'))).toString () + ' años - ' + p.genero.charAt(0).toUpperCase() + p.genero.slice(1) + '\n';  
      });

      list.push ({
        'Nombre comercial': e.nombre_comercial,
        'Nro. Certificado': e.nro_certificado,
        'RUC': e.ruc,
        'Correo': e.correo,
        'Provincia': e.provincia.nombre,
        'Distrito': e.distrito.nombre,
        'Fecha de aprobacion': e.fecha_aprobado,
        'Pagina web': e.pagina_web,
        'Representante Nombre': e.representante_nombre,
        'Representante Direccion': e.representante_direccion,
        'Representante Tipo de Documento': e.representante_tdoc,
        'Representante Documento': e.representante_ndoc,
        'Telefono': e.telefono,
        'Años - Genero': personal
      });
    });

    this.excelService.exportAsExcelFile (list, 'reporte');
  }

  get_date_format (date: string) {
    if (date === '' || date === undefined || date === null) {
      return '';
    }

    return moment (date).format ('ll');
  }

  aprobar (ref: any, item: any) {
    if (confirm ('¿Esta seguro que continuar?')) {
      this.is_upload = true;
      item.password = this.generate_password ();
      console.log (item);
      this.alojamiento_db.aprobar (item, item.password).then (() => {
        console.log ('Aprobado');
        ref.close ();
        this.is_upload = false;
        this.showToast ('top-right', 'El alojamiento se aprobo con exito');
        this.generar_pdf ('alojamiento-cartilla', 'alojamiento', item);
      }).catch ((error: any) => {
        console.log ('Error aprobar', error);
        ref.close ();
        this.is_upload = false;
      });
    }
  }

  aprobar_dialog (item: any, dialog: any) {
    item.password = '';
    console.log (item);
    this.dialog.open (dialog, {
      context: {
        item: item
      }
    });
  }

  showToast (position, text: string, status: any="success") {
    this.toastrService.show(
      '',
      text,
      { position, status });
  }

  generar_pdf (page: string, page2: string, item: any) {
    // qr_code.toDataURL ('http://www.dirceturcusco.gob.pe/#/' + page + '/' + page2 + '/' + item.id, (err: any, url: any) => {
    //   const doc = new jsPDF();

    //   doc.text(item.nombre_comercial, 30, 20);
    //   doc.addImage(url, 'JPEG', 15, 40, 180, 160);
    //   doc.save("certificado.pdf"); 

    //   console.log (url);
    // });
  }

  eliminar (item: any, eliminar_correo_ruc: boolean) {
    if (confirm ('¿Esta seguro que desea continuar?')) {
      this.alojamiento_db.eliminar (item, eliminar_correo_ruc)
    }
  }

  rechazar_dialog (dialog: any, item: any, ref: any) {
    this.dialog.open (dialog, {
      context: {
        item: item,
        ref: ref
      }
    });
  }

  rechazar (dialog: any, item: any, ref: any) {
    console.log (item);
    dialog.close ();
    this.is_upload = true;

    this.alojamiento_db.rechazar (item).
      then (() => {
        ref.close ();
        this.is_upload = false;
      })
      .catch ((error: any) => {
        console.log (error);
      })
  }

  get_anios (date: string) {
    var firstDate = moment (date);
    var secondDate = moment ();
    var duration = moment.duration (secondDate.diff(firstDate));
    return Math.round(duration.asYears ());
  }

  generate_password () {
    var length = 6,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    
    return retVal;
  }

  get_x_condicional (value: boolean) {
    if (value) {
      return 'x'
    }

    return ' ';
  }

  get_date (date: string) {
    return moment (date, "DD/MM/YYYY").format ('ll');
  }
  
  g_declaracion_alojamiento (data: any) {
    let dd: any = {
      content: [],
      defaultStyle: {
        columnGap: 20,
        fontSize: 11,
      }
    };

    dd.content.push (
      {
        text: 'DECLARACIÓN JURADA ALOJAMIENTO\n\n',
        alignment: "center",
        fontSize: 16,
        bold: true
      }
    );

    let tipo_declaracion = "REGISTRO NUEVO";
    if (data.registro_nuevo === '1') {
      tipo_declaracion = "ACTUALIZACIÓN DE DATOS";
    }

    dd.content.push (
      {
        text: '- ' + tipo_declaracion + '\n\n',
        alignment: "right",
      }
    );

    dd.content.push (
      {
        text: 'INFORMACIÓN DEL ESTABLECIMIENTO\n\n',
        fontSize: 13,
        bold: true
      }
    );

    // INFORMACIÓN DE LA PERSONA TITULAR
    dd.content.push ({
      columns: [
        {
          text: [
            {text: 'Razón Social:\n', bold: true},
            data.razon_social + '\n\n',
            {text: 'Nombre Comercial:\n', bold: true},
            data.nombre_comercial + '\n\n',
            {text: 'N.° de RUC:\n', bold: true},
            data.ruc + '\n\n',
            {text: 'Dirección completa:\n', bold: true},
            data.direccion + '\n\n',
            {text: 'Región:\n', bold: true},
            'Cusco' + '\n\n',
            {text: 'Provincia:\n', bold: true},
            data.provincia.nombre + '\n\n',
            {text: 'Distrito:\n', bold: true},
            data.distrito.nombre  + '\n\n',
          ],
        },
        {
          text: [
            {text: 'Página Web:\n', bold: true},
            data.pagina_web  + '\n\n',
            {text: 'Email:\n', bold: true},
            data.correo  + '\n\n',
            {text: 'Teléfono:\n', bold: true},
            data.telefono  + '\n\n',
            {text: 'Representante Legal:\n', bold: true},
            data.representante_nombre  + '\n\n',
            {text: 'Doc. Identidad:\n', bold: true},
            data.representante_tdoc  + '\n\n',
            {text: 'N.° Doc. Identidad:\n', bold: true},
            data.representante_ndoc  + '\n\n',
          ]
        },
        {
          text: [
            {text: 'Fecha inicio de operaciones:\n', bold: true},
            moment (data.fecha_ins.substring (0, 10)).format ('DD[-]MM[-]YYYY') + '\n\n',
            {text: 'N.° Licencia de Funcionamiento:\n', bold: true},
            data.numero_certificado + '\n\n',
            {text: 'Fecha de expedición:\n', bold: true},
            moment (data.fecha_exp.substring (0, 10)).format ('DD[-]MM[-]YYYY') + '\n\n',
          ]
        }
      ]}
    );

    // REQUISITOS MINIMOS
    dd.content.push (
      {
        text: 'REQUISITOS MÍNIMOS\n\n',
        fontSize: 13,
        bold: true
      }
    );

    dd.content.push ({
      columns: [{
          text: [
            {text: 'N.° de Habitaciones:\n', bold: true},
            data.numero_habitaciones + '\n\n',
            {text: 'Ingreso diferenciado para huéspedes y personal de servicio:\n', bold: true},
            data.ingreso_diferenciado + '\n\n',
            {text: 'N.° de Pisos:\n', bold: true},
            data.numero_pisos + '\n\n',
          ],
        }, {
          text: [
            {text: 'Número de personal ocupado:\n', bold: true},
            data.numero_personal + '\n\n',
            {text: 'Número de camas:\n', bold: true},
            data.numero_camas + '\n\n',
            {text: 'Número de baños privados:\n', bold: true},
            data.nro_banios_privados + '\n\n',
          ],
        }, {
          text: [
            {text: 'Numero de baños comunes:\n', bold: true},
            data.nro_banios_comunes + '\n\n'
          ]
        }
      ]}
    );

    dd.content.push (
      {
        columns: [
        {
          ul: [
            `(${this.get_x_condicional (data.req_min_inf_01)}) Área de recepción y consejería.`,
            `(${this.get_x_condicional (data.req_min_inf_02)}) El área de habitaciones (incluye el área del closet guardarropa) tiene como mínimo 6 m.`,
            `(${this.get_x_condicional (data.req_min_inf_03)}) El área de total de los SS.HH. privados o comunes tiene como mínimo 2 m.`,
            `(${this.get_x_condicional (data.req_min_inf_04)}) Los servicios higiénicos: Cuentan con pisos y paredes de material impermeable, el revestimiento de la pared tiene una altura mínima de 1.80 m.`,
            `(${this.get_x_condicional (data.req_min_inf_05)}) Contar con un ascensor a partir de (4) o más pisos.`,
            `(${this.get_x_condicional (data.req_min_inf_07)}) La edificación guarda armonía con el entorno en el que se ubica.`,
            `(${this.get_x_condicional (data.req_min_inf_08)}) Accesibilidad para personas con discapacidad y de las personas adultas mayores, según norma A.120.`,
            `(${this.get_x_condicional (data.req_min_inf_09)}) Para el diseño de acceso y salidas de emergencia pasajes de circulación de personas, escaleras, sistema contra incendios, etc., sé ha tomado en cuenta la norma A.130, requisitos de seguridad.`,
            `(${this.get_x_condicional (data.req_min_inf_10)}) Tabiquería: Los muros y divisiones interiores, especialmente entre dormitorios cumplen con los requisitos de seguridad del reglamento de edificaciones siendo combustibles, higiénicos y de fácil limpieza, brindando condiciones de privacidad y aislamiento acústico.`
          ],
        },
        {
          ul: [
            `(${this.get_x_condicional (data.req_min_eqp_01)}) Teléfono de uso público (puede ser teléfono fijo de recepción, celular, dependiendo de la zona y para uso exclusivo del huésped).`,
            `(${this.get_x_condicional (data.req_min_eqp_02)}) Botiquín de primeros auxilios según especificaciones técnicas del ministerio de salud.`,
            `(${this.get_x_condicional (data.req_min_eqp_03)}) Cuento con sistema que permita tener agua fría y caliente y las 24 horas del día el cual no es activado por el huésped.`
          ]
        }
        ]
      },
    );

    dd.content.push (
      {
        columns: [
        {
          ul: [
            `(${this.get_x_condicional (data.req_min_srv_01)}) Se realiza limpieza diaria de habitaciones y todos los ambientes del establecimiento.`,
            `(${this.get_x_condicional (data.req_min_srv_02)}) Brindo servicio de custodia de equipaje.`,
            `(${this.get_x_condicional (data.req_min_srv_03)}) El cambio de sábanas y toallas debe ser regular, (el huésped puede solicitar que no se cambie regularmente de acuerdo a criterios ambientales y otros).`
          ]
        },
        {

        },
        ]
      },
    );

    dd.content.push (
      {text: '\n\n'}
    );

    dd.content.push (
      'LA PRESENTE DECLARACIÓN JURADA LA REALIZO SEGÚN LO SEÑALADO EN EL NUMERAL 9.2 DEL ARTICULO 9 DEL REGLAMENTO DE AGENCIAS DE VIAJES Y TURISMO, APROBADO MEDIANTE D.S.001-2015- MINCETUR, MANIFESTANDO QUE LOS DATOS SEÑALADO EXPRESAN LA VERDAD Y QUE CONOZCO LAS SANCIONES ADMINISTRATIVAS Y PENALES A QUE HABRÁ LUGAR EN CASO DE FALSEDAD.'
    );

    pdfMake.createPdf (dd).download ('Declaracion Jurada.pdf');
  }

  ver_detalle (item: any) {
    this.router.navigate (['/pages/alojamiento/alojamiento-detalle', item.id]);
  }

  certificado (item: any) {
    this.descarga_cargando = true;
    this.alojamiento_db.get_certificado (item.id).subscribe ((res: any) => {
      console.log (res);
      this.downloadPDF (res.base64);
      this.descarga_cargando = false;
    }, error => {
      console.log (error);
      this.descarga_cargando = false;
    }); 
  }

  downloadPDF (pdf: any) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = "Certificado.pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  duplicados = new Map <string, any> ();
  get_duplicados () {
    this.duplicados.clear ();
    this.para_revisar.forEach ((item: any) => {
      let filter = this.para_revisar.filter (x => x.ruc === item.ruc);
      if (filter.length > 1) {
        if (this.duplicados.get (item.ruc) === undefined) {
          this.duplicados.set (item.ruc, filter);
        }
      }
    });

    console.log (this.duplicados);
  }

  actualizar_fecha () {
    console.log (this.items);
  }

  editar_formulario (data: any) {
    data._razon_social = data.item.razon_social;
    data._nombre_comercial = data.item.nombre_comercial;
    data._direccion = data.item.direccion;
    data._pagina_web = data.item.pagina_web;
    data._telefono = data.item.telefono;
    data._representante_tdoc = data.item.representante_tdoc;
    data._representante_ndoc = data.item.representante_ndoc;

    this.disabled_form = false;
  }

  cancelar_editar_formulario (data: any) {
    data.item.razon_social = data._razon_social;
    data.item.nombre_comercial = data._nombre_comercial;
    data.item.direccion = data._direccion;
    data.item.pagina_web = data._pagina_web;
    data.item.telefono = data._telefono;
    data.item.representante_tdoc = data._representante_tdoc;
    data.item.representante_ndoc = data._representante_ndoc;

    this.disabled_form = true;
  }

  actualizar_data (item: any, ref: any) {
    if (confirm ('¿Esta seguro que desea continuar?')) {
      this.is_upload = true;
      console.log (item);

      this.alojamiento_db.updateHotel (item, [])
        .then (() => {
          this.is_upload = false;
          this.showToast ('top-right', 'La agencia se actualizo con exito');
          this.disabled_form = true;
        }).catch ((error: any) => {
          this.is_upload = false;
          this.showToast ('top-right', 'Error', 'danger');
        });
    }
  }

  filter () {
    this.items = this._items;

    if (this.search_text.trim () !== '') {
      this.items = this.items.filter ((p: any) => {
        return p.nombre_comercial.toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1 || 
        p.direccion.toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1 ||
        p.telefono.toString ().toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1 ||
        p.representante_nombre.toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1 ||
        p.representante_ndoc.toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1 ||
        this.get_ruc (p.ruc).toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1;
      });
    }
  }

  get_ruc (ruc: any): String {
    if (Number (ruc) !== NaN) {
      return Number (ruc).toString ();
    }

    return ruc;
  }
}
