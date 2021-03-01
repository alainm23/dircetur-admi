import { Component, OnInit } from '@angular/core';

// Services
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as XLSX from 'xlsx';

import { Router } from '@angular/router';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  provincias: any [] = [];
  name = 'This is XLSX TO JSON CONVERTER';
  willDownload: boolean = false;

  libro: string = "Hoja1";

  jsonData = null;
  idioms: any [] = [];
  centros_formacion: any [] = [];
  coles: any [] = [];

  list: any [] = [];
  constructor(public auth: AuthService, 
              public database: DatabaseService,
              private afs: AngularFirestore,
              public router: Router) { }

  ngOnInit() {
    // this.database.getProvinciasDistritos ().subscribe ((res: any) => {
    //   this.provincias = res;
    //   console.log (res);
    // });

    this.afs.collection ('Agencias', ref => ref.where ('aprobado', '==', true)).valueChanges ().subscribe ((res: any []) => {
      console.log (res);
      res.forEach ((data: any) => {
        console.log (data.id, data.fecha_aprobado);
      });
    });
  }

  // Guias
  onFileChange (ev) {
    let workBook = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read (data, { type: 'binary' });
      this.jsonData = workBook.SheetNames.reduce ((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json (sheet);
        return initial;
      }, {});

      console.log (this.jsonData);
      // onsole.log ('get_centro_de_formacion', this.get_centro_de_formacion (this.jsonData));
      // console.log ('colegio profesional', this.get_cole (this.jsonData));
      // console.log ('get_idiomas', this.get_idiomas (this.jsonData));

      // this.centros_formacion = this.get_centro_de_formacion (this.jsonData);
      // this.idioms = this.get_idiomas (this.jsonData);
      // this.coles = this.get_cole (this.jsonData);

      this.jsonData [this.libro].forEach ((d: any) => {
        let data: any = {
          id: this.database.createId (),
          nombres: this.valid_data (d ['Nombre1']) + this.valid_data (d ['Nombre 2']),
          apellidos: this.valid_data (d ['Apellido Paterno']) + this.valid_data (d ['Apellido Materno']),
          direccion: this.valid_data (d ['Direccion']),
          nro_carnet: this.valid_data (d ['Nro Carnet']),
          observaciones: this.valid_data (d ['Observaciones']),
          ruc: this.valid_data (d ['Ruc']),
          telefono: this.valid_data (d ['Telefono']),
          dni: d ['DDDDDDDDDDDDDDDDD'],
          correo: d ['Correo Electronico'],
          password: Math.random ().toString (36).slice (-8),
          provincia: this.get_provincia (this.valid_data (d ['Provincia'])),
          distrito: this.get_distrito (this.valid_data (d ['Provincia']), this.valid_data (d ['Departamento']))
        }

        this.list.push (data);
      });

      console.log (this.list);
    }

    reader.readAsBinaryString(file);
  }

  valid_data (data: any) {
    if (data === null || data === undefined) {
      return '';
    }

    return data;
  }

  async subir () {
    const wordsPerLine = Math.ceil(this.list.length / 11)
    const result = [[], [], [], [], [],
                    [], [], [], [], [],
                    []]

    for (let line = 0; line < 11; line++) {
      for (let i = 0; i < wordsPerLine; i++) {
        const value = this.list[i + line * wordsPerLine]
        if (!value) continue //avoid adding "undefined" values
        result[line].push(value)
      }
    }

    result.forEach ((r: any []) => {
      r.forEach ((d: any) => {
        console.log (d);
      });
    });

    // let batch = this.afs.firestore.batch ();
    
    // this.idioms.forEach ((e: any) => {
    //     batch.set (this.afs.collection ('Guia_Idiomas').doc (e.id).ref, e);  
    // });

    // await batch.commit ().then (() => {
    //   console.log ('terminado');
    // }).catch ((error: any) => {
    //   console.log (error);
    // });
  }

  // Guias -----------------------------------------
  get_centro_de_formacion (jsonData: any) {
    let list: any [] = [];

    jsonData [this.libro].forEach ((e: any) => {
      if (list.find (x => x.nombre === e ['ASOCIACION']) === undefined) {
        if (e ['ASOCIACION'] !== undefined) {
          list.push ({
            id: this.database.createId (),
            nombre: e ['ASOCIACION'],
            date_added: new Date ().toISOString ()
          });
        }
      }
    });

    return list;
  }

  get_cole (jsonData: any) {
    let list: any [] = [];

    jsonData [this.libro].forEach ((e: any) => {
      if (list.find (x => x.nombre === e ['ASOCIACIÓN Y/O COLEGIO PROFESIONAL']) === undefined) {
        if (e ['ASOCIACIÓN Y/O COLEGIO PROFESIONAL'] !== undefined) {
          list.push ({
            id: this.database.createId (),
            nombre: e ['ASOCIACIÓN Y/O COLEGIO PROFESIONAL']
          });
        }
      }
    });

    list.forEach ((e: any) => {
      e.nombre = e.nombre.replace ('INSTITUTO : ', '').replace ('UNIVERSIDAD : ', '')
    });

    console.log (list);

    return list;
  }

  get_idiomas (jsonData: any) {
    let list: any [] = [];

    jsonData [this.libro].forEach ((e: any) => {
      if (e ['instituo de idioma'] !== undefined) {
        let idiomas = e ['instituo de idioma'].split ("-");
        idiomas.forEach ((idioma: string) => {
          if (list.find (x => x.nombre.trim ().toUpperCase () === idioma.trim ().toUpperCase ()) === undefined) {
            list.push ({
              id: this.database.createId (),
              nombre: idioma.trim ().toUpperCase (),
              date_added: new Date ().toISOString ()
            });
          }
        });
      }
    });

    return list;
  }

  // subir () {
  //   let list: any [] = [];

  //   this.jsonData [this.libro].forEach ((e: any) => {
  //     let nro_documento = e ['DOC. IDENTIDAD'];
  //     if (nro_documento !== undefined) {
  //       nro_documento = nro_documento.replace ('DNI ', '');
  //     }

  //     let centro_formacion: string = e ['INSTITUTO O CENTRO DE FORMACIÓN'];
  //     if (centro_formacion !== undefined) {
  //       centro_formacion = this.centros_formacion.find (x => x.nombre === centro_formacion.replace ('INSTITUTO : ', '').replace ('UNIVERSIDAD : ', ''));
  //     } else {
  //       centro_formacion = '';
  //     }
      
  //     let asociacion_colegio = e ['ASOCIACIÓN Y/O COLEGIO PROFESIONAL'];
  //     if (asociacion_colegio !== undefined) {
  //       asociacion_colegio = this.coles.find (x => x.nombre == asociacion_colegio);
  //     } else {
  //       asociacion_colegio = '';
  //     }

  //     let correo: string = e ['CORREO ELECTRÓNICO'];
  //     if (correo === undefined) {
  //       correo == '';
  //     }

  //     let idiomas: any [] = [];
  //     let _idiomas: any [] = [];
  //     if (e ['IDIOMA EXTRANJERO'] !== undefined) {
  //       _idiomas = e ['IDIOMA EXTRANJERO'].split (',');
  //       _idiomas.forEach ((idioma: any) => {
  //         idiomas.push (this.idioms.find (x => x.nombre === idioma));
  //       });
  //     }

  //     list.push ({
  //       id: this.database.createId (),
  //       ruc: e ['RUC'],
  //       nombre_completo: e ['APELLIDOS Y NOMBRES'],
  //       nro_documento: nro_documento,
  //       nro_carne: e ['NRO DE CARNE'],
  //       direccion: e ['DIRECCIÓN DEL ESTABLECIMIENTO'],
  //       telefono: e ['TELF.'],
  //       correo_personal: correo,
  //       fecha_exp: e ['FECHA DE EXPEDICIÓN'],
  //       fecha_ins: e ['FEC.INIC'],
  //       provincia: this.get_provincia (e ['DEPARTAMENTO/PROVINCIA/DISTRITO']),
  //       distrito: this.get_distrito (e ['DEPARTAMENTO/PROVINCIA/DISTRITO']),
  //       idiomas: idiomas,
  //       centro_formacion: centro_formacion,
  //       asociacion_colegio: asociacion_colegio,
  //       correo: correo,
  //       contraseña: '',
  //     })
  //   });

  //   console.log ('get_centro_de_formacion', this.centros_formacion);
  //   console.log ('colegio profesional', this.coles);
  //   console.log ('get_idiomas', this.idioms);

  //   console.log (list);
  //   this.database.subir_guias_script (list, this.centros_formacion, this.coles, this.idioms);
  // }

  // ------------------------------------------

  // Restaurates
  // onFileChange (ev) {
  //   let workBook = null;
  //   const reader = new FileReader();
  //   const file = ev.target.files[0];
  //   reader.onload = (event) => {
  //     const data = reader.result;
  //     workBook = XLSX.read (data, { type: 'binary' });
  //     this.jsonData = workBook.SheetNames.reduce ((initial, name) => {
  //       const sheet = workBook.Sheets[name];
  //       initial[name] = XLSX.utils.sheet_to_json (sheet);
  //       return initial;
  //     }, {});

  //     console.log (this.jsonData);
  //     console.log ('Grupo', this.get_list (this.jsonData, 'Listado_directorio3', 'GRUPO', '-'));
  //     console.log ('Clase', this.get_list (this.jsonData, 'Listado_directorio3', 'CLASE', '-'));
  //     console.log ('Categoria', this.get_list (this.jsonData, 'Listado_directorio3', 'CATEGORÍA', '-'));
  //     console.log ('CLASE AGV', this.get_list (this.jsonData, 'Listado_directorio3', 'CLASE AGV', '-'));
  //     console.log ('TIPO DE TURISMO', this.get_list (this.jsonData, 'Listado_directorio3', 'TIPO DE TURISMO', '-'));
  //     console.log ('MODALIDAD DE TURISMO', this.get_list (this.jsonData, 'Listado_directorio3', 'MODALIDAD DE TURISMO', '-'));
  //     console.log ('UNIDAD DE TRANSP. TURISTICO', this.get_list (this.jsonData, 'Listado_directorio3', 'UNIDAD DE TRANSP. TURISTICO', '-'));
  //   }

  //   reader.readAsBinaryString(file);
  // }

  get_list (object: any, book: string, column: string, d: string) {
    let list: any [] = [];
    
    object [book].forEach ((e: any) => {
      if (list.find (x => x.nombre === this.get_value (e, column, d)) === undefined)  {
        list.push ({
          id: this.database.createId (),
          nombre: this.get_value (e, column, d)
        });
      }
    });

    return list;
  }

  // Agencias
  subir_agencias () {
    let list: any [] = [];

    this.jsonData [this.libro].forEach ((e: any) => {
      list.push ({
        id: this.database.createId (),
        nombre_comercial: this.get_value (e, 'NOMBRE COMERCIAL', ''),
        razon_social: this.get_value (e, 'RAZÓN SOCIAL', ''),
        ruc: this.get_value (e, 'RUC', ''),
        direccion: this.get_value (e, 'DIRECCIÓN DEL ESTABLECIMIENTO', ''),
        telefono: this.get_value (e, 'TELF.', ''),
        pagina_web: this.get_value (e, 'WEB', ''),
        numero_certificado: '',
        fecha_ins: '',
        fecha_exp: '',
        clasificacion: '',
        provincia: this.get_provincia (e ['DEPARTAMENTO/PROVINCIA/DISTRITO']),
        // distrito: this.get_distrito (e ['DEPARTAMENTO/PROVINCIA/DISTRITO']),
        servicios_complementarios: '',
        observaciones: '',
        representante_nombre: this.get_value (e, 'REPRE. LEGAL', ''),
        representante_tdoc: 'DNI',
        representante_ndoc: this.get_value (e, 'DNI REPRE. LEGAL', ''),
        representante_telefono: this.get_value (e, 'TELF.', ''),
        representante_direccion: '',
        representante_correo: '',
        correo: this.get_value (e, 'CORREO ELECTRÓNICO', ''),
        contraseña: ''
      });
    });
  }

  // Hoteles
  subir_hoteles () {
    // this.get_list (this.jsonData, 'CLASE', 'No clasificado');

    let list: any [] = [];

    this.jsonData [this.libro].forEach ((e: any) => {
      list.push ({
        id: this.database.createId (),
        nombre_comercial: this.get_value (e, 'NOMBRE COMERCIAL', ''),
        numero_habitaciones: this.get_value (e, 'HABIT. DIRECT.', 0),
        numero_camas: this.get_value (e, 'CAMAS DIRECT.', 0),
        razon_social: this.get_value (e, 'RAZÓN SOCIAL', ''),
        ruc: this.get_value (e, 'RUC', ''),
        direccion: this.get_value (e, 'DIRECCIÓN DEL ESTABLECIMIENTO', ''),
        telefono: this.get_value (e, 'TELF.', ''),
        pagina_web: this.get_value (e, 'WEB', ''),
        numero_certificado: this.get_value (e, 'NRO. CERTIF.', ''),
        fecha_ins: '',
        fecha_exp: '',
        clase: '',
        categoria: '',
        provincia: this.get_provincia (e ['DEPARTAMENTO/PROVINCIA/DISTRITO']),
        // distrito: this.get_distrito (e ['DEPARTAMENTO/PROVINCIA/DISTRITO']),
        servicios_complementarios: '',
        observaciones: '',
        correo: this.get_value (e, 'CORREO ELECTRÓNICO', ''),
        contraseña: '',
        representante_nombre: this.get_value (e, 'REPRE. LEGAL', ''),
        representante_tdoc: 'DNI',
        representante_ndoc: this.get_value (e, 'DNI REPRE. LEGAL', ''),
        representante_telefono: this.get_value (e, 'TELF.', ''),
        representante_direccion: '',
        representante_correo: '',
      });
    });
  }

  // Restaurantes
  subir_restaurantes () {
    let list: any [] = [];

    this.jsonData [this.libro].forEach ((e: any) => {
      list.push ({
        id: this.database.createId (),
        nombre_comercial: this.get_value (e, 'NOMBRE COMERCIAL', ''),
        cantidad_mesas: this.get_value (e, 'MESAS DIRECT.', 0),
        cantidad_sillas: this.get_value (e, 'SILLAS DIRECT.', 0),
        razon_social: this.get_value (e, 'RAZÓN SOCIAL', ''),
        ruc: this.get_value (e, 'RUC', ''),
        direccion: this.get_value (e, 'DIRECCIÓN DEL ESTABLECIMIENTO', ''),
        telefono: this.get_value (e, 'TELF.', ''),
        pagina_web: this.get_value (e, 'WEB', ''),
        numero_certificado: this.get_value (e, 'NRO. CERTIF.', ''),
        fecha_ins: '',
        fecha_exp: '',
        calificacion: '',
        categoria: '',
        provincia: this.get_provincia (e ['DEPARTAMENTO/PROVINCIA/DISTRITO']),
        // distrito: this.get_distrito (e ['DEPARTAMENTO/PROVINCIA/DISTRITO']),
        servicios_complementarios: '',
        observaciones: this.get_value (e, 'DIRECCIÓN DEL ESTABLECIMIENTO', ''),
        correo: this.get_value (e, 'CORREO ELECTRÓNICO', ''),
        contraseña: '',
        representante_nombre: this.get_value (e, 'REPRE. LEGAL', ''),
        representante_tdoc: 'dni',
        representante_ndoc: this.get_value (e, 'DNI REPRE. LEGAL', ''),
        representante_telefono: '',
        representante_direccion: '',
        representante_correo: '',
      });
    });

    this.database.subir_restaurantes_script (list);
  }


  get_value (object: any, value: string, d: any) {
    let returned;
    returned = object [value];
    
    if (returned === undefined) {
      returned = d;
    }

    return returned;
  }

  get_provincia (data: string) {
    let returned: any = '';
    this.provincias.forEach ((provincia: any) => {
      if (provincia.data.nombre.toLowerCase ().includes (data.toLowerCase ())) {
        returned = provincia.data;
      }
    });

    return returned;
  }

  get_distrito (p: string, data: string) {
    let returned: any = '';
    this.provincias.forEach ((provincia: any) => {
      if (provincia.data.nombre.toLowerCase ().includes (p.toLowerCase ())) {
        provincia.distritos.forEach ((distrito: any) => {
          if (distrito.nombre.toLowerCase ().includes (data.toLowerCase ())) {
            returned = distrito;
          }
        });
      }
    });

    return returned;
  }
}