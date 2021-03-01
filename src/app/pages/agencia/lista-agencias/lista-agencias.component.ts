import { Component, OnInit } from '@angular/core';

// Services
import { DatabaseService } from '../../../services/database.service';
import { AgenciaDatabaseService } from '../../../services/agencia-database.service';
import { ExcelService } from '../../../services/excel.service';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { NbDialogService, NbToastrService } from '@nebular/theme';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Nebular
// import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

@Component({
  selector: 'ngx-lista-agencias',
  templateUrl: './lista-agencias.component.html',
  styleUrls: ['./lista-agencias.component.scss']
})
export class ListaAgenciasComponent implements OnInit {
  form: FormGroup;

  provincia_seleccionada: any;
  distrito_seleccionado: any;
  provincias: any [] = [];
  distritos: any [] = [];
  para_revisar: any [] = [];
  tipo_para_revisar: string = 'todo';
  items: any [];
  _items: any [];
  
  contador: number = 0;
  
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

  contador_provincias: number = 0;
  contador_distritos: number = 0;
  is_upload: boolean = false;

  disabled_form: boolean = true;
  search_text: string = '';
  // customColumn = 'N°';
  // defaultColumns = [ 'Nombre', 'Aprobado', 'Telefono', 'Tipo', 'Representante', 'Opciones' ];
  // allColumns = [ this.customColumn, ...this.defaultColumns ];

  // dataSource: NbTreeGridDataSource<any>;
  // sortColumn: string;
  // sortDirection: NbSortDirection = NbSortDirection.NONE;
  constructor(private database: DatabaseService,
              private agencia_db: AgenciaDatabaseService,
              private excelService:ExcelService,
              private dialog: NbDialogService,
              private toastrService: NbToastrService,
              // private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
              private router: Router) { }

  ngOnInit() {
    this.provincias_cargando = true;
    
    this.subscribe_01 = this.database.getEstadisticasPorProvincias ().subscribe ((response: any []) => {
      this.provincias = response;
      this.provincias_cargando = false; 
    });

    this.agencia_db.getAgenciaTipo_Clasificaciones ().subscribe ((response: any []) => {
      this.tipo_clasificaciones = response;
    });

    this.agencia_db.getModalidad_Turismo ().subscribe ((response: any []) => {
      this.modalidad_turismo = response;
    });

    this.agencia_db.getTipos_Turismo ().subscribe ((res: any []) => {
      this.tipos_turismo = res;
    });

    this.agencia_db.get_agencias_para_revisar ().subscribe ((res: any []) => {
      this.para_revisar = res.sort ((a: any, b: any) => {
        return new Date (b.fecha_solicitud).getTime () - new Date (a.fecha_solicitud).getTime ();
      });

      this.get_duplicados ();
    });
  }
  
  format_list (res: any []) {
    let returned: any [] = [];
    res.forEach ((i: any) => {
      let data: any = {};

      data ['data'] = i;
      data ['N°'] = 0;
      data ['Nombre'] = i.nombre_comercial;
      data ['Aprobado'] = this.get_date (i.fecha_aprobado);
      data ['Telefono'] = i.telefono;
      data ['Tipo'] = '';
      data ['Representante'] = '';
      data ['Opciones'] = 'accion';

      returned.push ({
        data: data
      })
    });

    return returned;
  }

  get_total_provincias () {
    let contador = 0;
    this.provincias.forEach ((e: any) => {
      let returned: number = 0;
      if (e ['total_agencias' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
        returned = e ['total_agencias' + this.year_seleccionado + this.mes_seleccionado];
      }

      contador += returned;
    }); 

    return contador;
  }

  get_contador_distritos () {
    let contador = 0;
    this.distritos.forEach ((e: any) => {
      let returned: number = 0;
      if (e ['total_agencias' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
        returned = e ['total_agencias' + this.year_seleccionado + this.mes_seleccionado];
      }

      contador += returned;
    }); 

    return contador;
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

    this.agencia_db.getAgenciasByProvincias (this.provincia_seleccionada.id).subscribe ((data: any []) => {
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

    this.agencia_db.getAgenciasByDistritos (this.distrito_seleccionado.id).subscribe ((data: any []) => {
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

  ir_vista (view: string) {
    this.view = view;
  }

  year_changed () {
    if (this.year_seleccionado === '') {
      this.mes_seleccionado = '';
    }
  }

  month_changed () {
  }

  get_cantidad (item: any) {
    let returned: number = 0;

    if (item ['total_agencias' + this.year_seleccionado + this.mes_seleccionado] != undefined) {
      returned = item ['total_agencias' + this.year_seleccionado + this.mes_seleccionado];
    }
    
    return returned;
  }

  /* Estadisticas */

  filtrar () {
    console.log ("Cambio mrd");
    this.items = this._items;

    this.items = this.items.filter ((item: any) => {
      console.log (item);
      return this.check_clasificacion (item) && this.check_modalidad (item) && this.check_tipo (item);
    });

    this.contador = this.items.length;
  }

  check_clasificacion (item: any): boolean {
    if (this.clasificacion_seleccionado === "") {
      return true
    }

    return this.clasificacion_seleccionado === item.clasificacion.id;
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

  exportAsXLSX () {
    let list: any [] = [];
    this.items.forEach ((e: any) => {
      let personal: string = '';
      e.personal.forEach ((p: any) => {
        personal += '-' + (Number (moment ().format ('YYYY')) - Number (moment (p.anio_nacimiento).format ('YYYY'))).toString () + ' años - ' + p.genero.charAt(0).toUpperCase() + p.genero.slice(1) + '\n';  
      });

      let tipos_turismo: string = '';
      e.tipos_turismo.forEach ((p: any) => {
        tipos_turismo += '-' + p.nombre + '\n';
      });

      let modalidad_turismo: string = '';
      e.modalidad_turismo.forEach ((p: any) => {
        modalidad_turismo += '-' + p.nombre + '\n';
      });

      let tipo: string = '';
      if (e.solo_digital === true) {
        tipo = 'Virtual';
      } else {
        if (e.canal_digital === '0') {
          tipo = 'Fisica';
        } else if (e.canal_digital === '1') {
          tipo = 'Fisica / Virtual';
        }
      }

      let representante_departamento: string  = '';
      if (e.representante_departamento === undefined) {
        representante_departamento = e.representante_region + '/' + e.representante_provincia + '/' + e.representante_distrito;
      } else {
        representante_departamento = e.representante_departamento;
      }

      let data: any = {
        'Nombre comercial': e.nombre_comercial,
        'Nro. Certificado': e.nro_certificado,
        'Asociacion': e.asociacion_turismo,
        'Tipo de agencia': tipo,
        'Canales donde opera': e.canales_opera,
        'Cantidad de equipos': e.cantidad_equipos_computo,
        'Clasificacion': e.clasificacion.nombre,
        'Correo': e.correo,
        'Cuentas en redes sociales': e.cuentas_redes_sociales,
        'Provincia': e.provincia.nombre,
        'Distrito': e.distrito.nombre,
        'Fecha de aprobacion': e.fecha_aprobado,
        'Pagina web': e.pagina_web,
        'Representante Nombre': e.representante_nombre,
        'Representante Region/Provincia/Distrito': representante_departamento,
        'Representante Direccion': e.representante_direccion,
        'Representante Tipo de Documento': e.representante_tdoc,
        'Representante Documento': e.representante_ndoc,
        'Representante Razon Social': e.representante_razon_social,
        'Representante RUC': e.representante_ruc,
        'Telefono': e.telefono,
        'Transporte turístico terrestre': e.trans_terres,
        'Transporte turístico acuático': e.trans_acuatico,
        'Transporte aéreo especial en actividades de turismo': e.trans_arere,
        'N.° de unidades para brindar el servicio': e.nro_unidades_sericio,
        'Señalar el número de placas': e.nro_placas_transporte,
        'Telefono Fijo': e.telefono_fijo,
        'Tipos de turismo': tipos_turismo,
        'Modalidad de turismo': modalidad_turismo,
        'Años - Genero': personal
      };

      list.push (data);
    });

    this.excelService.exportAsExcelFile (list, 'reporte');
  }

  ver_detalle (item: any) {
    this.router.navigate (['/pages/agencia/agencia-detalle', item.id]);
  }

  certificado (item: any) {
    this.descarga_cargando = true;
    this.agencia_db.get_certificado (item.id).subscribe ((res: any) => {
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

  get_date_format (date: string) {
    if (date === '' || date === undefined || date === null) {
      return '';
    }

    return moment (date.substring (0, 10)).format ('ll');
  }

  get_date (date: string) {
    return moment (date, "DD/MM/YYYY").format ('ll');
  }

  actualizar_data (item: any, ref: any) {
    if (confirm ('¿Esta seguro que desea continuar?')) {
      this.is_upload = true;
      console.log (item);

      this.agencia_db.updateAgencia (item, [])
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

  aprobar (ref: any, item: any) {
    if (confirm ('¿Esta seguro que desea continuar?')) {
      this.is_upload = true;
      item.password = this.generate_password ();
      console.log (item);
      this.agencia_db.aprobar (item, item.password).then (() => {
        console.log ('Aprobado');
        ref.close ();
        this.is_upload = false;
        this.showToast ('top-right', 'La agencia se aprobo con exito');
      }).catch ((error: any) => {
        console.log ('Error aprobar', error);
        ref.close ();
        this.is_upload = false;
      });
    }
  } 

  showToast (position, text: string, status: any="success") {
    this.toastrService.show(
      '',
      text,
      { position, status });
  }

  aprobar_dialog (item: any, dialog: any) {
    console.log (item);
    console.log ('Aqu');
    
    this.dialog.open (dialog, {
      context: {
        item: item
      }
    });
  }

  eliminar (item: any, eliminar_ruc: boolean) {
    if (confirm ('¿Esta seguro que desea continuar?')) {
      this.agencia_db.eliminar_agencia (item, eliminar_ruc);
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

    this.agencia_db.rechazar_agencia (item).
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

  generar_declaracion (data: any) {
    if (data.solo_digital === undefined) {
      this.g_declaracion_a_fisica (data);
    } else {
      this.g_declaracion_a_virtual (data);
    }
  }

  g_declaracion_a_fisica (data: any) {
    let dd: any = {
      content: [],
      defaultStyle: {
        columnGap: 20,
        fontSize: 11,
      }
    };

    dd.content.push (
      {
        text: 'DECLARACIÓN JURADA AGENCIA FISICA\n\n',
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
        text: 'INFORMACIÓN DE LA PERSONA TITULAR\n\n',
        fontSize: 13,
        bold: true
      }
    );

    let representante_titulo = 'Nombres y Apellidos:\n'
    if (data.representante_tipo === '1') {
      representante_titulo = 'Razón Social:\n';
    }

    let representante_value = data.representante_nombre;
    if (data.representante_tipo === '1') {
      representante_value = data.representante_razon_social;
    }

    let representante_legal_titulo = '';
    if (data.representante_tipo === '1') {
      representante_legal_titulo = 'Representante legal:';
    }

    let representante_legal_valor = '';
    if (data.representante_tipo === '1') {
      representante_legal_valor = data.representante_nombre;
    }

    // INFORMACIÓN DE LA PERSONA TITULAR
    dd.content.push ({
      columns: [
        {
          text: [
            {text: representante_titulo, bold: true},
            representante_value + '\n\n',
            {text: 'N° de RUC:\n', bold: true},
            data.representante_ruc + '\n\n',
            {text: 'Domicilio legal:\n', bold: true},
            data.representante_direccion + '\n\n',
            {text: representante_legal_titulo + '\n', bold: true},
            representante_legal_valor + '\n\n'
          ],
        },
        {
          text: [
            {text: 'Región:\n', bold: true},
            data.representante_region + '\n\n',
            {text: 'Provincia:\n', bold: true},
            data.representante_provincia + '\n\n',
            {text: 'Distrito:\n', bold: true},
            data.representante_distrito  + '\n\n',
          ]
        },
        {
          text: [
            {text: 'Tipo Doc. Identidad:\n', bold: true},
            data.representante_tdoc + '\n\n',
            {text: 'N° Doc. Identidad:\n', bold: true},
            data.representante_ndoc + '\n\n',
            {text: 'Domicilio legal:\n', bold: true},
            data.representante_direccion + '\n\n'
          ]
        }
      ]}
    );

    // CONDICIONES MINIMAS PARA LA PRESTACION DE SERVICIOS (ANEXO I DEL REGLAMENTO)
    dd.content.push (
      {
        text: 'INFORMACIÓN DEL ESTABLECIMIENTO\n\n',
        fontSize: 13,
        bold: true
      }
    );
    dd.content.push ({
      columns: [{
          text: [
            {text: 'Nombre comercial:\n', bold: true},
            data.nombre_comercial + '\n\n',
            {text: 'Dirección:\n', bold: true},
            data.direccion + '\n\n',
            {text: 'Región:\n', bold: true},
            'Cusco' + '\n\n',
            {text: 'Provincia:\n', bold: true},
            data.provincia.nombre + '\n\n',
            {text: 'Distrito:\n', bold: true},
            data.distrito.nombre + '\n\n',
          ],
        }, {
          text: [
            {text: 'Tel. celular:\n', bold: true},
            data.telefono + '\n\n',
            {text: 'Tel. fijo:\n', bold: true},
            data.telefono_fijo + '\n\n',
            {text: 'Página web:\n', bold: true},
            data.pagina_web + '\n\n',
            {text: 'Correo electrónico:\n', bold: true},
            data.correo + '\n\n',
          ],
        }, {
          text: [
            {text: 'Enlace a redes sociales:\n', bold: true},
            data.cuentas_redes_sociales + '\n\n',
            {text: 'Fecha de inicio de operaciones:\n', bold: true},
            moment (data.fecha_ins.substring (0, 10)).format ('DD[-]MM[-]YYYY') + '\n\n',
            {text: 'N° de licencia de funcionamiento:\n', bold: true},
            data.numero_certificado + '\n\n',
            {text: 'Fecha de expedición:\n', bold: true},
            moment (data.fecha_exp.substring (0, 10)).format ('DD[-]MM[-]YYYY') + '\n\n'
          ]
        }
      ]}
    );

    // CONDICIONES MINIMAS PARA LA PRESTACION DE SERVICIOS (ANEXO I DEL REGLAMENTO)
    dd.content.push (
      {
        text: 'CONDICIONES MÍNIMAS PARA LA PRESTACION DE SERVICIOS (ANEXO I DEL REGLAMENTO)\n\n',
        fontSize: 13,
        bold: true
      }
    );
    dd.content.push (
      {
        columns: [
        {
          ul: [
            {text: `(${this.get_x_condicional (data.cond_min_ps_01)}) Oficina administrativa`},
            {text: `(${this.get_x_condicional (data.cond_min_ps_02)}) Local de libre acceso al público para atender al turista y dedicado a prestar de manera exclusiva al servicio de agencia de viajes y turismo.`},
            {text: `(${this.get_x_condicional (data.cond_min_ps_03)}) Independizada de los locales de negocio colindantes.`},
          ],
        },
        {
          ul: [
            {text: `(${this.get_x_condicional (data.cond_min_ps_04)}) Equipo de cómputo: ` + data.cantidad_equipos_computo + ' unds.'},
            {text: `(${this.get_x_condicional (data.cond_min_ps_05)}) Conexion a internet y correo electronico.`},
            {text: `(${this.get_x_condicional (data.cond_min_ps_06)}) Teléfono.`},
            {text: `(${this.get_x_condicional (data.cond_min_ps_07)}) Equipo de impresora y escáner.`}
          ]
        }
        ]
      },
    );
    dd.content.push ({text: '\n\n'});
    dd.content.push ({
      columns: [
        {
          ul: [
            `a) (${this.get_x_condicional (data.cond_min_ps_08)}) Con experiencia minima de un (1) año en actividades turisticas y que haya llevado por lo menos un curso de técnicas de atencion al caliente`,
            `b) (${this.get_x_condicional (data.cond_min_ps_09)}) Con formación académica superiór o técnico productiva en materia de turismo`,
          ],
        },
        {
          text: [
            {text: 'Total de personal calificado:\n', bold: true},
            data.total_personal_calificado + '\n\n',
          ]
        }
      ]
    });

    if (data.canal_digital === '1') {
      dd.content.push ({text: '\n\n'});

      dd.content.push ({
        text: 'CONDICIONES MINIMAS PARA LA PRESTACIÓN DEL SERVICIO A TRAVÉS DE CANALES DIGITALES (ARTICULO 22 DEL REGLAMENTO) (1)\n\n',
        fontSize: 13,
        bold: true
      });

      dd.content.push ({
        text: 'Canales en los cuales opera:\n', bold: true
      });

      dd.content.push (
        data.canales_opera + '\n\n',
      );

      dd.content.push (
        {
          columns: [
          {
            ul: [
              `(${this.get_x_condicional (data.cond_min_cd_01)}) Ser propietario, licenciatario o administrador de canales digitales para la oferta, promoción, comercialización y, en general, la prestación de sus servicios, los cuales incluyen los contenidos minimos siguientes:`,
              `(${this.get_x_condicional (data.cond_min_cd_02)}) Número de teléfono, dirección y datos de contacto de la agencia de viajes y turismo y correo eletronico, las cuales pueden ser utilizados para asisitir y/o atender y/o asesorar al consumidor.`,
              `(${this.get_x_condicional (data.cond_min_cd_03)}) Número de RUC.`,
              `(${this.get_x_condicional (data.cond_min_cd_04)}) Razón social o nombres y apellidos, segun corresponde.`,
              `(${this.get_x_condicional (data.cond_min_cd_05)}) Nombre comercial.`,
              `(${this.get_x_condicional (data.cond_min_cd_06)}) Politica de protección de datos personales.`,
              `(${this.get_x_condicional (data.cond_min_cd_07)}) Términos y Condiciones de Uso del canal digital, lo que incluye, entre otros aspectos, las politicas de cobro, cancelacion y reembolso.`,
              `(${this.get_x_condicional (data.cond_min_cd_08)}) Contancia de inscripcion en el Directorio Nacional de Prestadores de Servicios Turisticos Calificados, cuando esta sea expedida.`,
              `(${this.get_x_condicional (data.cond_min_cd_09)}) Versión digital del afiche u otro documento similar, que contenga informacion respecto de las disposiciones legales que sancionan penalmente las conductas vinculadas a las ESNNA, de acuerdo a las caracteristicas y contenido establecidos por el MINCETUR, asi como las que sancionan el hecho de tener relaciones sexuales con menores de edad, sin perjuicio de otras medidas que puedan adoptar con el mismo fin.`
            ],
          },
          {
            ul: [
              `(${this.get_x_condicional (data.cond_min_cd_10)}) El contenido detallado en el literal a) está publicado empleando un lenguaje claro, sencillo y transparente. Ademas, esta dispuesto de manera que el acceso a los mismos de la pagina de inicio del canal digital es asequible.`,
              `(${this.get_x_condicional (data.cond_min_cd_13)}) Con experiencia minima de un (1) año en actividades turisticas y que haya llevado por lo menos un curso de técnicas de atencion al caliente.`,
              `(${this.get_x_condicional (data.cond_min_cd_14)}) Con formación académica superiór o técnico productiva en materia de turismo.`,
              `(${this.get_x_condicional (data.cond_min_cd_11)}) Medidas de seguridad y diligencia debida en la interfaz para la compras en linea, lo que incluye las herramientas empleadas para procesar los pagos.`,
              `(${this.get_x_condicional (data.cond_min_cd_12)}) Medidas técnicas de protección de los datos personales que son recabados a través del canal digital.`
            ]
          },
          ]
        },
      );
    }

    dd.content.push (
      {text: '\n\n'}
    );

    dd.content.push (
      {
        text: 'CLASIFICACION\n',
        fontSize: 13,
        bold: true
      },
    );

    dd.content.push (data.clasificacion.nombre + '\n\n');

    dd.content.push (
      {text: '\n\n'}
    );

    // Modalidad de turismo
    dd.content.push (
      {
        text: 'MODALIDAD DE TURISMO\n',
        fontSize: 13,
        bold: true
      },
    );

    let modalidad_turismo: any [] = [];
    data.modalidad_turismo.forEach ((element: any) => {
      if (element.id === 'xi55CdN2tkJdm9d63iN3') {
        modalidad_turismo.push (element.nombre + ', N° de certificado: ' + data.turismo_aventura_certificado);
      } else {
        modalidad_turismo.push (element.nombre)
      }
    });

    dd.content.push (
      {
        ul: modalidad_turismo
      },
    );

    dd.content.push (
      {text: '\n\n'}
    );

    // Tipos de turismo
    dd.content.push (
      {
        text: 'TIPO DE TURISMO\n',
        fontSize: 13,
        bold: true
      },
    );

    let tipos_turismo: any [] = [];
    data.tipos_turismo.forEach ((element: any) => {
      tipos_turismo.push (element.nombre);
    });

    dd.content.push (
      {
        ul: tipos_turismo
      },
    );

    dd.content.push (
      {text: '\n\n'}
    );

    dd.content.push (
      {
        text: 'OTRA INFORMACIÓN\n',
        fontSize: 13,
        bold: true
      },
    );

    dd.content.push (
      {
        columns: [
        {
          text: [
            {text: 'Asociación de turismo a la que pertenece:\n', bold: true},
            data.asociacion_turismo + '\n\n',
            {text: 'Clasificacion de calidad, sostenibilidad u otro reconocimiento especial que ostenta referencia a su periodo de vigencia:\n', bold: true},
            data.clasificacion_calidad + '\n\n',
            {text: 'N° de unidades para brindar el servicio:\n', bold: true},
            data.nro_unidades_sericio + '\n\n',
            {text: 'Señalar el número de placas:\n', bold: true},
            data.nro_placas_transporte + '\n\n',
          ]
        },
        {
          ul: [
            `(${this.get_x_condicional (data.trans_terres)}) Transporte turístico terrestre`,
            `(${this.get_x_condicional (data.trans_acuatico)}) Transporte turistico acuático`,
            `(${this.get_x_condicional (data.trans_arere)}) Transporte aéreo especial en actividades de turismo`
          ]
        }]
      },
    );

    dd.content.push (
      {text: '\n\n'}
    );

    dd.content.push (
      {
        text: 'DECLARACIONES\n',
        fontSize: 13,
        bold: true
      },
    );

    dd.content.push (
      {text: '\n\n'}
    );

    dd.content.push (
      'LA PRESENTE DECLARACIÓN JURADA LA REALIZO SEGÚN LO SEÑALADO EN EL NUMERAL 9.2 DEL ARTICULO 9 DEL REGLAMENTO DE AGENCIAS DE VIAJES Y TURISMO, APROBADO MEDIANTE D.S.005-2020- MINCETUR, MANIFESTANDO QUE LOS DATOS SEÑALADO EXPRESAN LA VERDAD Y QUE CONOZCO LAS SANCIONES ADMINISTRATIVAS Y PENALES A QUE HABRA LUGAR EN CASO DE FALSEDAD.'
    );

    pdfMake.createPdf (dd).download ('Declaracion Jurada.pdf');
  }

  get_x_condicional (value: boolean) {
    if (value) {
      return 'x'
    }

    return ' ';
  }

  g_declaracion_a_virtual (data: any) {
    let dd: any = {
      content: [],
      defaultStyle: {
        columnGap: 20,
        fontSize: 11,
      }
    };

    dd.content.push (
      {
        text: 'DECLARACIÓN JURADA AGENCIA DE VIAJES Y TURISMO VIRTUAL\n\n',
        alignment: "center",
        fontSize: 16,
        bold: true
      }
    );

    dd.content.push (
      {
        text: '- REGISTRO NUEVO' + '\n\n',
        alignment: "right",
      }
    );

    dd.content.push (
      {
        text: 'INFORMACIÓN DE LA PERSONA TITULAR\n\n',
        fontSize: 13,
        bold: true
      }
    );

    let representante_titulo = 'Nombres y Apellidos:\n'
    if (data.representante_tipo === '1') {
      representante_titulo = 'Razon Social:\n';
    }

    let representante_value = data.representante_nombre;
    if (data.representante_tipo === '1') {
      representante_value = data.representante_razon_social;
    }

    let representante_legal_titulo = '';
    if (data.representante_tipo === '1') {
      representante_legal_titulo = 'Representante legal:';
    }

    let representante_legal_valor = '';
    if (data.representante_tipo === '1') {
      representante_legal_valor = data.representante_nombre;
    }

    // INFORMACIÓN DE LA PERSONA TITULAR
    dd.content.push ({
      columns: [
        {
          text: [
            {text: representante_titulo, bold: true},
            representante_value + '\n\n',
            {text: 'N° de RUC:\n', bold: true},
            data.representante_ruc + '\n\n',
            {text: 'Domicilio legal:\n', bold: true},
            data.representante_direccion + '\n\n',
            {text: representante_legal_titulo + '\n', bold: true},
            representante_legal_valor + '\n\n'
          ],
        },
        {
          text: [
            {text: 'Región:\n', bold: true},
            data.representante_region + '\n\n',
            {text: 'Provincia:\n', bold: true},
            data.representante_provincia + '\n\n',
            {text: 'Distrito:\n', bold: true},
            data.representante_distrito  + '\n\n',
          ]
        },
        {
          text: [
            {text: 'Tipo Doc. Identidad:\n', bold: true},
            data.representante_tdoc + '\n\n',
            {text: 'N° Doc. Identidad:\n', bold: true},
            data.representante_ndoc + '\n\n',
          ]
        }
      ]}
    );

    // INFORMACIÓN DEL ESTABLECIMIENTO
    dd.content.push (
      {
        text: 'INFORMACIÓN DEL ESTABLECIMIENTO\n\n',
        fontSize: 13,
        bold: true
      }
    );
    dd.content.push ({
      columns: [{
          text: [
            {text: 'Nombre comercial:\n', bold: true},
            data.nombre_comercial + '\n\n',
            {text: 'Región:\n', bold: true},
            'Cusco' + '\n\n',
            {text: 'Provincia:\n', bold: true},
            data.provincia.nombre + '\n\n',
            {text: 'Distrito:\n', bold: true},
            data.distrito.nombre + '\n\n',
          ],
        }, {
          text: [
            {text: 'Tel. celular:\n', bold: true},
            data.telefono + '\n\n',
            {text: 'Tel. fijo:\n', bold: true},
            data.telefono_fijo + '\n\n',
            {text: 'Página web:\n', bold: true},
            data.pagina_web + '\n\n',
            {text: 'Correo electronico:\n', bold: true},
            data.correo + '\n\n',
          ],
        }, {
          text: [
            {text: 'Enlace a redes sociales:\n', bold: true},
            data.cuentas_redes_sociales + '\n\n'
          ]
        }
      ]}
    );

    dd.content.push ({text: '\n\n'});

    dd.content.push ({
      text: 'CONDICIONES MÍNIMAS PARA LA PRESTACION DEL SERVICIO A TRAVÉS DE CANALES DIGITALES (ARTICULO 22 DEL REGLAMENTO) (1)\n\n',
      fontSize: 13,
      bold: true
    });

    dd.content.push ({
      text: 'Canales en los cuales opera:\n', bold: true
    });

    dd.content.push (
      data.canales_opera + '\n\n',
    );

    dd.content.push (
      {
        columns: [
        {
          ul: [
            `(${this.get_x_condicional (data.cond_min_cd_01)}) Ser propietario, licenciatario o administrador de canales digitales para la oferta, promocion, comercializacion y, en general, la prestacion de sus servicios, los cuales incluyen los contenidos mínimos siguientes:`,
            `(${this.get_x_condicional (data.cond_min_cd_02)}) Número de teléfono, dirección y datos de contacto de la agencia de viajes y turismo y correo eletronico, las cuales pueden ser utilizados para asisitir y/o atender y/o asesorar al consumidor.`,
            `(${this.get_x_condicional (data.cond_min_cd_03)}) Número de RUC.`,
            `(${this.get_x_condicional (data.cond_min_cd_04)}) Razón social o nombres y apellidos, según corresponde.`,
            `(${this.get_x_condicional (data.cond_min_cd_05)}) Nombre comercial.`,
            `(${this.get_x_condicional (data.cond_min_cd_06)}) Política de protección de datos personales.`,
            `(${this.get_x_condicional (data.cond_min_cd_07)}) Términos y Condiciones de Uso del canal digital, lo que incluye, entre otros aspectos, las politicas de cobro, cancelación y reembolso.`,
            `(${this.get_x_condicional (data.cond_min_cd_08)}) Contancia de inscripción en el Directorio Nacional de Prestadores de Servicios Turisticos Calificados, cuando esta sea expedida.`,
            `(${this.get_x_condicional (data.cond_min_cd_09)}) Versión digital del afiche u otro documento similar, que contenga informacion respecto de las disposiciones legales que sancionan penalmente las conductas vinculadas a las ESNNA, de acuerdo a lascaracteristicas y contenido establecidos por el MINCETUR, asi como las que sancionan el hecho de tener relaciones sexuales con menores de edad, sin perjuicio de otras medidas que puedan adoptar con el mismo fin.`
          ],
        },
        {
          ul: [
            `(${this.get_x_condicional (data.cond_min_cd_10)}) El contenido detallado en el literal a) está publicado empleando un lenguaje claro, sencillo y transparente. Ademas, esta dispuesto de manera que el acceso a los mismos desde la página de inicio del canal digital es asequible.`,
            `(${this.get_x_condicional (data.cond_min_cd_13)}) Con experiencia mínima de un (1) año en actividades turísticas y que haya llevado por lo menos un curso de técnicas de atención al caliente.`,
            `(${this.get_x_condicional (data.cond_min_cd_14)}) Con formación académica superiór o técnico productiva en materia de turismo.`,
            `(${this.get_x_condicional (data.cond_min_cd_11)}) Medidas de seguridad y diligencia debida en la interfaz para la compras en linea, lo que incluye las herramientas empleadas para procesar los pagos.`,
            `(${this.get_x_condicional (data.cond_min_cd_12)}) Medidas tecnicas de proteccion de los datos personales que son recabados a través del canal digital.`
          ]
        },
        ]
      },
    );

    dd.content.push (
      {text: '\n\n'}
    );

    dd.content.push (
      {
        text: 'CLASIFICACION\n',
        fontSize: 13,
        bold: true
      },
    );

    dd.content.push (data.clasificacion.nombre + '\n\n');

    dd.content.push (
      {text: '\n\n'}
    );

    // Modalidad de turismo
    dd.content.push (
      {
        text: 'MODALIDAD DE TURISMO\n',
        fontSize: 13,
        bold: true
      },
    );

    let modalidad_turismo: any [] = [];
    data.modalidad_turismo.forEach ((element: any) => {
      if (element.id === 'xi55CdN2tkJdm9d63iN3') {
        modalidad_turismo.push (element.nombre + ', N° de certificado: ' + data.turismo_aventura_certificado);
      } else {
        modalidad_turismo.push (element.nombre)
      }
    });

    dd.content.push (
      {
        ul: modalidad_turismo
      },
    );

    dd.content.push (
      {text: '\n\n'}
    );

    // Tipos de turismo
    dd.content.push (
      {
        text: 'TIPO DE TURISMO\n',
        fontSize: 13,
        bold: true
      },
    );

    let tipos_turismo: any [] = [];
    data.tipos_turismo.forEach ((element: any) => {
      tipos_turismo.push (element.nombre);
    });

    dd.content.push (
      {
        ul: tipos_turismo
      },
    );

    dd.content.push (
      {text: '\n\n'}
    );

    dd.content.push (
      {
        text: 'OTRA INFORMACIÓN\n',
        fontSize: 13,
        bold: true
      },
    );

    dd.content.push (
      {
        columns: [
        {
          text: [
            {text: 'Asociación de turismo a la que pertenece:\n', bold: true},
            data.asociacion_turismo + '\n\n',
            {text: 'Clasificacion de calidad, sostenibilidad u otro reconocimiento especial que ostenta referencia a su periodo de vigencia:\n', bold: true},
            data.clasificacion_calidad + '\n\n',
            {text: 'N° de unidades para brindar el servicio:\n', bold: true},
            data.nro_unidades_sericio + '\n\n',
            {text: 'Señalar el número de placas:\n', bold: true},
            data.nro_placas_transporte + '\n\n',
          ]
        },
        {
          ul: [
            `(${this.get_x_condicional (data.trans_terres)}) Transporte turístico terrestre`,
            `(${this.get_x_condicional (data.trans_acuatico)}) Transporte turistico acuático`,
            `(${this.get_x_condicional (data.trans_arere)}) Transporte aéreo especial en actividades de turismo`
          ]
        }]
      },
    );

    dd.content.push (
      {text: '\n\n'}
    );

    dd.content.push (
      {
        text: 'DECLARACIONES\n',
        fontSize: 13,
        bold: true
      },
    );

    dd.content.push (
      {text: '\n\n'}
    );

    dd.content.push (
      'LA PRESENTE DECLARACIÓN JURADA LA REALIZO SEGÚN LO SEÑALADO EN EL NUMERAL 9.2 DEL ARTICULO 9 DEL REGLAMENTO DE AGENCIAS DE VIAJES Y TURISMO, APROBADO MEDIANTE D.S.005-2020- MINCETUR, MANIFESTANDO QUE LOS DATOS SEÑALADO EXPRESAN LA VERDAD Y QUE CONOZCO LAS SANCIONES ADMINISTRATIVAS Y PENALES A QUE HABRA LUGAR EN CASO DE FALSEDAD.'
    );

    pdfMake.createPdf (dd).download ('Declaracion Jurada.pdf');
  }

  duplicados = new Map <string, any> ();
  get_duplicados () {
    this.duplicados.clear ();
    this.para_revisar.forEach ((item: any) => {
      let filter = this.para_revisar.filter (x => x.representante_ruc === item.representante_ruc);
      if (filter.length > 1) {
        if (this.duplicados.get (item.representante_ruc) === undefined) {
          this.duplicados.set (item.representante_ruc, filter);
        }
      }
    });

    console.log (this.duplicados);
  }

  editar_formulario (data: any) {
    data._representante_nombre = data.item.representante_nombre;
    data._representante_direccion = data.item.representante_direccion;
    data._representante_razon_social = data.item.representante_razon_social;
    data._representante_tdoc = data.item.representante_tdoc;
    data._representante_ndoc = data.item.representante_ndoc;

    data._nombre_comercial = data.item.nombre_comercial;
    data._direccion = data.item.direccion;
    data._telefono = data.item.telefono;
    data._telefono_fijo = data.item.telefono_fijo;
    data._pagina_web = data.item.pagina_web;
    data._cuentas_redes_sociales = data.item.cuentas_redes_sociales;

    this.disabled_form = false;
  }

  cancelar_editar_formulario (data: any) {
    data.item.representante_nombre = data._representante_nombre;
    data.item.representante_direccion = data._representante_direccion;
    data.item.representante_razon_social = data._representante_razon_social;
    data.item.representante_tdoc = data._representante_tdoc;
    data.item.representante_ndoc = data._representante_ndoc;

    data.item.nombre_comercial = data._nombre_comercial;
    data.item.direccion = data._direccion;
    data.item.telefono = data._telefono;
    data.item.telefono_fijo = data._telefono_fijo
    data.item.pagina_web = data._pagina_web;
    data.item.cuentas_redes_sociales = data._cuentas_redes_sociales;

    this.disabled_form = true;
  }

  filter () {
    this.items = this._items;

    if (this.search_text.trim () !== '') {
      this.items = this.items.filter ((p: any) => {
        return p.nombre_comercial.toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1 || 
        p.telefono.toString ().toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1 ||
        p.representante_nombre.toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1 ||
        p.representante_ndoc.toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1 ||
        this.get_ruc (p.representante_ruc).toLowerCase ().indexOf (this.search_text.toLowerCase ()) > -1;
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
