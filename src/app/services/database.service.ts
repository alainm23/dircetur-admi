import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { first, map } from 'rxjs/operators';
import { combineLatest, of } from "rxjs";
import * as firebase from 'firebase/app'; 
import 'firebase/firestore';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private afs: AngularFirestore) {

  }

  createId () {
    return this.afs.createId ();
  }

  getUser (id: string) {
    return this.afs.collection ("Users").doc (id).valueChanges ();
  }

  /*  
  *   Sanciones CRUD 
  */  

  getSanciones () {
    return this.afs.collection ('Sanciones', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateSancion (data: any) {
    return this.afs.collection ('Sanciones').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addSancion (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('Sanciones').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeSancion (data: any) {
    return this.afs.collection ('Sanciones').doc (data.id).delete ();
  }

  /*  
  *   Reconocimientos CRUD 
  */  

  getReconocimientos () {
    return this.afs.collection ('Reconocimientos', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateReconocimiento (data: any) {
    return this.afs.collection ('Reconocimientos').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addReconocimiento (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('Reconocimientos').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeReconocimiento (data: any) {
    return this.afs.collection ('Reconocimientos').doc (data.id).delete ();
  }

  /*
    Estadisticas  
  */

  getEstadisticasPorProvincias () {
    return this.afs.collection ('Estadisticas_Prestadores_Provincias').valueChanges ();
  }

  getEstadisticasPorDistrito (provincia_id: string) {
    return this.afs.collection ('Estadisticas_Prestadores_Distritos', ref => ref.where ('provincia_id', '==', provincia_id)).valueChanges ();
  }

  /*
    Tipos_Turismo
  */

  getTipos_Turismo () { 
    return this.afs.collection ('Tipos_Turismo', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let checked = false;
          const id = a.payload.doc.id;
          return { id, checked, ...data };
      });
    });
  }

  updateTipos_Turismo (data: any) {
    return this.afs.collection ('Tipos_Turismo').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addTipos_Turismo (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('Tipos_Turismo').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeTipos_Turismo (data: any) {
    return this.afs.collection ('Tipos_Turismo').doc (data.id).delete ();
  }

  /*
    Categoria Blogs
  */

  getBlog_Categorias () { 
    return this.afs.collection ('Blog_Categorias', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateBlog_Categorias (data: any) {
    return this.afs.collection ('Blog_Categorias').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addBlog_Categorias (data: string) {
    let id = this.afs.createId ();

    return this.afs.collection ('Blog_Categorias').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeBlog_Categorias (data: any) {
    return this.afs.collection ('Blog_Categorias').doc (data.id).delete ();
  }

  /*
    Provincias
  */

  getProvincias () {
    return this.afs.collection ('Provincias').valueChanges ();
  }

  getProvinciasDistritos () {
    const collection = this.afs.collection ('Provincias');

    return collection.snapshotChanges ().pipe (map (refReferencias => {
      if (refReferencias.length > 0) {
        return refReferencias.map (refReferencia => {
          const data: any = refReferencia.payload.doc.data();
          return this.getDistritosByProvincias (data.id).pipe (map (distritos => Object.assign ({}, { data, distritos })));
        });
      }
    })).mergeMap (observables => {
      if (observables) {
        return combineLatest(observables);
      } else {
        return of([]);
      }
    });
  }

  getDistritosByProvincias (id: string) {
    return this.afs.collection ('Provincias').doc (id).collection ('Distritos').valueChanges ();
  }

  /*
    Verificacion de correos 
  */

  is_email_valid (email: string) {
    return this.afs.collection ('Correos_Usados').doc (email).valueChanges ();
  }
  
  getEventosTipos () {
    return this.afs.collection ('Eventos_Tipos', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateEventosTipos (data: any) {
    return this.afs.collection ('Eventos_Tipos').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addEventosTipos (data: string) {
    let id = this.afs.createId ();

    return this.afs.collection ('Eventos_Tipos').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString (),
      eliminable: true
    });
  }

  removeEventosTipos (data: any) {
    return this.afs.collection ('Eventos_Tipos').doc (data.id).delete ();
  }

  /*

  */

  getEventosArtesaniaTipos () {
    return this.afs.collection ('Eventos_Artesania_Tipos', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateEventosArtesaniaTipos (data: any) {
    return this.afs.collection ('Eventos_Artesania_Tipos').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addEventosArtesaniaTipos (data: any) {
    data.id = this.afs.createId ();

    return this.afs.collection ('Eventos_Artesania_Tipos').doc (data.id).set ({
      id: data.id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeEventosArtesaniaTipos (data: any) {
    return this.afs.collection ('Eventos_Artesania_Tipos').doc (data.id).delete ();
  }

  /*
    Clasificacion
  */

  getEventosCategorias () {
    return this.afs.collection ('Eventos_Categorias', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateEventosCategorias (data: any) {
    return this.afs.collection ('Eventos_Categorias').doc (data.id).update ({
      name: data.name
    });
  }

  addEventosCategorias (data: any) {
    data.id = this.afs.createId ();

    return this.afs.collection ('Eventos_Categorias').doc (data.id).set ({
      id: data.id,
      name: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeEventosCategorias (data: any) {
    return this.afs.collection ('Eventos_Categorias').doc (data.id).delete ();
  }

  /*
    Calendario Turisticos
  */

  async addEvento (data: any) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Eventos').doc (data.id).ref;
    batch.set (step_01, data);

    return await batch.commit ();
  }

  async updateEvento (data: any, fecha_antigua: string) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Eventos').doc (data.id).ref;
    batch.update (step_01, data);

    if (data.fecha !== fecha_antigua) {
      const step_04 = this.afs.collection ('Eventos_Fechas').doc (moment(fecha_antigua.substring (0, 10)).format('MM')).collection ("Eventos").doc (data.id).ref;
      batch.delete (step_04);

      const step_05 = this.afs.collection ('Eventos_Fechas').doc (moment(data.fecha.substring (0, 10)).format('MM')).collection ("Eventos").doc (data.id).ref;
      batch.set (step_05, {
        id: data.id
      });
    }

    return await batch.commit ();
  }

  getEventos () {
    return this.afs.collection ('Eventos').valueChanges ();
  }

  getEventoById (id: string) {
    return this.afs.collection ('Eventos').doc (id).valueChanges ();
  }
  

  getEventosMes (mes: string) {
    const collection = this.afs.collection ('Eventos_Fechas').doc (mes).collection ("Eventos")

    return collection.snapshotChanges ().pipe (map (refReferencias => {
      if (refReferencias.length > 0) {
        return refReferencias.map (refReferencia => {
          const data: any = refReferencia.payload.doc.data();
          return this.getEventoById (data.id).pipe (map (ref => Object.assign ({}, { data, ref })));
        });
      }
    })).mergeMap (observables => {
      if (observables) {
        return combineLatest(observables);
      } else {
        return of([]);
      }
    });
  }

  async deleteEvento (data: any) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Eventos').doc (data.id).ref;
    const step_02 = this.afs.collection ('Eventos_Fechas').doc (moment(data.fecha).format('MM')).collection ("Eventos").doc (data.id).ref;
    const step_03 = this.afs.collection ('Provincias').doc (data.provincia.id).collection ('Lista_Eventos').doc (data.id).ref;
    const step_04 = this.afs.collection ('Provincias').doc (data.provincia.id).collection ('Distritos').doc (data.distrito.id).collection ('Lista_Eventos').doc (data.id).ref;
    
    batch.delete (step_01);
    batch.delete (step_02);
    batch.delete (step_03);
    batch.delete (step_04);

    return await batch.commit ();
  }
  
  /*
    Calendatio Artesanal
  */

  async addEventoArtesania (data: any) {
    data.id = this.afs.createId ();
    
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Eventos_Artesania').doc (data.id).ref;
    batch.set (step_01, data);
    
    return await batch.commit ();
  }

  async updateEventoArtesania (data: any, fecha_antigua: string) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Eventos_Artesania').doc (data.id).ref;
    batch.update (step_01, data);
    
    const step_02 = this.afs.collection ('Provincias').doc (data.provincia.id).collection ('Lista_Eventos_Artesania').doc (data.id).ref;
    batch.update (step_02, {
      'id': data.id,
      'titulo': data.titulo,
      'fecha': data.fecha,
      'organizador': data.organizador
    });

    const step_03 = this.afs.collection ('Provincias').doc (data.provincia.id).collection ('Distritos').doc (data.distrito.id).collection ('Lista_Eventos_Artesania').doc (data.id).ref;
    batch.update (step_03, {
      'id': data.id,
      'titulo': data.titulo,
      'fecha': data.fecha,
      'organizador': data.organizador
    });

    if (data.fecha !== fecha_antigua) {
      const step_04 = this.afs.collection ('Eventos_Artesania_Fechas').doc (moment(fecha_antigua).format('MM')).collection ("Eventos").doc (data.id).ref;
      batch.delete (step_04);

      const step_05 = this.afs.collection ('Eventos_Artesania_Fechas').doc (moment(data.fecha).format('MM')).collection ("Eventos").doc (data.id).ref;
      batch.set (step_05, {
        id: data.id
      });
    }

    return await batch.commit ();
  }

  getEventosArtesania () {
    return this.afs.collection ('Eventos_Artesania').valueChanges ();
  }

  getEventoArtesaniaById (id: string) {
    return this.afs.collection ('Eventos_Artesania').doc (id).valueChanges ();
  }
  
  getEventosArtesaniaMes (mes: string) {
    const collection = this.afs.collection ('Eventos_Artesania_Fechas').doc (mes).collection ("Eventos")

    return collection.snapshotChanges ().pipe (map (refReferencias => {
      if (refReferencias.length > 0) {
        return refReferencias.map (refReferencia => {
          const data: any = refReferencia.payload.doc.data();
          return this.getEventoArtesaniaById (data.id).pipe (map (ref => Object.assign ({}, { data, ref })));
        });
      }
    })).mergeMap (observables => {
      if (observables) {
        return combineLatest(observables);
      } else {
        return of([]);
      }
    });
  }

  async deleteEventoArtesania (data: any) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Eventos_Artesania').doc (data.id).ref;
    const step_02 = this.afs.collection ('Eventos_Artesania_Fechas').doc (moment(data.fecha).format('MM')).collection ("Eventos").doc (data.id).ref;
    const step_03 = this.afs.collection ('Provincias').doc (data.provincia.id).collection ('Lista_Eventos_Artesania').doc (data.id).ref;
    const step_04 = this.afs.collection ('Provincias').doc (data.provincia.id).collection ('Distritos').doc (data.distrito.id).collection ('Lista_Eventos_Artesania').doc (data.id).ref;
    
    batch.delete (step_01);
    batch.delete (step_02);
    batch.delete (step_03);
    batch.delete (step_04);

    return await batch.commit ();
  }

  /*
    Blog
  */

  async addBlog (data: any) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Blogs').doc (data.id).ref;
    batch.set (step_01, data);

    const step_02 = this.afs.collection ('Blog_Categorias').doc (data.categoria.id).collection ("Blogs").doc (data.id).ref;
    batch.set (step_02, {
      id: data.id
    });

    return await batch.commit ();
  }

  getBlogs () {    
    return this.afs.collection ("Blogs").valueChanges ();
  }

  getBlogById (id: string) {
    return this.afs.collection ("Blogs").doc (id).valueChanges ();
  }

  async updateBlog (data: any, categoria_old: any) {
    let batch = this.afs.firestore.batch ();
    
    const step_01 = this.afs.collection ("Blogs").doc (data.id).ref;
    batch.update (step_01, data);

    if (categoria_old !== undefined && categoria_old !== null) {
      if (data.categoria.id !== categoria_old.id) {
          const step_02 = this.afs.collection ("Blog_Categorias").doc (categoria_old.id).collection ("Blogs").doc (data.id).ref;
          batch.delete (step_01);

          const step_04 = this.afs.collection ('Blog_Categorias').doc (data.categoria.id).collection ("Blogs").doc (data.id).ref;
          batch.set (step_04, {
            id: data.id
          });
      }
    } else {
      const step_04 = this.afs.collection ('Blog_Categorias').doc (data.categoria.id).collection ("Blogs").doc (data.id).ref;
      batch.set (step_04, {
        id: data.id
      });
    }

    return await batch.commit ();
  }

  async deleteBlog (item: any) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Blogs').doc (item.id).ref;
    batch.delete (step_01);

    const step_02 = this.afs.collection ('Blog_Categorias').doc (item.categoria.id).collection ("Blogs").doc (item.id).ref;
    batch.delete (step_02);

    return await batch.commit ();
  }

  /*
    Circuitosos Turisticos
  */

  async addCircuito (data: any, dias: any []) {
    let batch = this.afs.firestore.batch ();
    const step_01 = this.afs.collection ('Circuitos_Turisticos').doc (data.id).ref;

    batch.set (step_01, data);

    dias.forEach ((dia: any) => {
      let stepx = this.afs.collection ('Circuitos_Turisticos').doc (data.id).collection ("Dias").doc (dia.id).ref;
      batch.set (stepx, dia);
    });

    return await batch.commit ();
  }

  getCircuitos () {
    return this.afs.collection ("Circuitos_Turisticos").valueChanges ();
  }

  deleteCircuito (id: string) {
    return this.afs.collection ("Circuitos_Turisticos").doc (id).delete ();
  }

  deleteTRC (id: string) {
    return this.afs.collection ("Turismo_Rural").doc (id).delete ();
  }

  getCircuitoById (id: string) {
    return this.afs.collection ("Circuitos_Turisticos").doc (id).valueChanges ();
  }

  async updateCircuito (data: any, dias: any []) {
    let batch = this.afs.firestore.batch ();
    const step_01 = this.afs.collection ("Circuitos_Turisticos").doc (data.id).ref;
    batch.update (step_01, data);

    dias.forEach ((dia: any) => {
      let stepx = this.afs.collection ('Circuitos_Turisticos').doc (data.id).collection ("Dias").doc (dia.id).ref;
      batch.set (stepx, dia);
    });

    return await batch.commit ();
  }

  getCircuitoDias (id: string) {
    return this.afs.collection ("Circuitos_Turisticos").doc (id).collection ("Dias").valueChanges ();
  }

  // Viaje Programado

  async addViajeProgramado (data: any) {    
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Viajes_Programados').doc (data.id).ref;
    batch.set (step_01, {
      id: data.id,
      nombre: data.nombre,
      resumen: data.resumen,
      tags: data.tags,
      disponible: data.disponible,
      imagen: data.imagen,
      donde: data.donde,
      altitud: data.altitud,
      fecha_proxima_salida: data.fecha_proxima_salida,
      nro_salidas: data.nro_salidas,
      estado: 0
    });

    const step_02 = this.afs.collection ('Viajes_Programados').doc (data.id).collection ("Detalle").doc ("Detalle").ref;
    batch.set (step_02, data);

    return await batch.commit ();  
  }

  async updateViajeProgramado (data: any) {
    let batch = this.afs.firestore.batch ();
    const step_01 = this.afs.collection ("Viajes_Programados").doc (data.id).ref;
    batch.update (step_01, data);
    
    return await batch.commit ();
  }

  getViajesProgramados () {
    return this.afs.collection ('Viajes_Programados').valueChanges ();
  }

  getViajesProgramadoById (id: string) {
    return this.afs.collection ('Viajes_Programados').doc (id).valueChanges ();
  }

  async deleteViajesProgramados (item: any) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ("Viajes_Programados").doc (item.id).ref;
    batch.delete (step_01);

    /*
    const step_02 = this.afs.collection ("Viajes_Programados").doc (item.id).collection ("Salidas").ref;
    batch.delete (step_02);
    */
    
    return await batch.commit ();
  }

  // Turismo Rural

  async addTurismoRural (data: any) {    
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Turismo_Rural').doc (data.id).ref;

    batch.set (step_01, data);

    return await batch.commit ();  
  }

  async updateTurismoRural (data: any) {
    let batch = this.afs.firestore.batch ();
    const step_01 = this.afs.collection ("Turismo_Rural").doc (data.id).ref;
    batch.update (step_01, data);
    
    return await batch.commit ();
  }

  getTurismoRural () {
    return this.afs.collection ('Turismo_Rural').valueChanges ();
  }

  getTurismoRuralById (id: string) {
    return this.afs.collection ('Turismo_Rural').doc (id).valueChanges ();
  }

  // Sobre Dircetur

  async addFuncion (data: any) {
    data.id = this.afs.createId ();

    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Dircetur_Funciones').doc (data.id).ref;

    batch.set (step_01, data);

    return await batch.commit ();  
  }

  removeFuncion (id: any) {
    return this.afs.collection ('Dircetur_Funciones').doc (id).delete ();
  }

  updateFuncion (data: any) {
    return this.afs.collection ('Dircetur_Funciones').doc (data.id).update (data);
  }
  
  getFunciones () {
    return this.afs.collection ('Dircetur_Funciones').valueChanges ();
  }

  async addJunta (data: any) {
    data.id = this.afs.createId ();

    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Dircetur_JuntaDirectiva').doc (data.id).ref;

    batch.set (step_01, data);

    return await batch.commit ();  
  }

  removeJunta (id: any) {
    return this.afs.collection ('Dircetur_JuntaDirectiva').doc (id).delete ();
  }

  updateJunta (data: any) {
    return this.afs.collection ('Dircetur_JuntaDirectiva').doc (data.id).update (data);
  }

  getJunta () {
    return this.afs.collection ('Dircetur_JuntaDirectiva').valueChanges ();
  }

  /*  
    FAQCategorias
  */

  getFAQCategorias () { 
    return this.afs.collection ('FAQ_Categorias', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateFAQCategorias (data: any) {
    return this.afs.collection ('FAQ_Categorias').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addFAQCategorias (data: string) {
    let id = this.afs.createId ();

    return this.afs.collection ('FAQ_Categorias').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeFAQCategorias (data: any) {
    return this.afs.collection ('FAQ_Categorias').doc (data.id).delete ();
  }

  async addFAQ (data: any, categoria: any) {
    data.id = this.afs.createId ();

    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('FAQs').doc (data.id).ref;
    batch.set (step_01, data);

    const step_02 = this.afs.collection ('FAQ_Categorias').doc (categoria.id).collection ('FAQs').doc (data.id).ref;
    batch.set (step_02, {
      id: data.id,
      pregunta: data.pregunta,
      respuesta: data.respuesta
    });

    return await batch.commit ();  
  }

  getFAQs (id: string) {
    return this.afs.collection ('FAQ_Categorias').doc (id).collection ('FAQs').valueChanges ();
  }

  async removeFAQ (id: string, categoria: any) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('FAQs').doc (id).ref;
    batch.delete (step_01);

    const step_02 = this.afs.collection ('FAQ_Categorias').doc (categoria.id).collection ('FAQs').doc (id).ref;
    batch.delete (step_02);

    return await batch.commit (); 
  }

  async updateFAQ (data: any, categoria: any) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('FAQs').doc (data.id).ref;
    batch.update (step_01, data);

    const step_02 = this.afs.collection ('FAQ_Categorias').doc (categoria.id).collection ('FAQs').doc (data.id).ref;
    batch.update (step_02, data);

    return await batch.commit (); 
  }

  /* Boleto Turistico */
  async addBoletoTuristico (data: any) {    
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Boleto_Turistico').doc (data.id).ref;
    batch.set (step_01, data);
    
    return await batch.commit ();
  }

  update_BoletoTuristico (data: any) {
    return this.afs.collection ('Boleto_Turistico').doc (data.id).update (data);
  }

  getBoletosTuristicos () {
    return this.afs.collection ('Boleto_Turistico').valueChanges ();
  }

  deleteBoletosTuristicos (id: string) {
    return this.afs.collection ('Boleto_Turistico').doc (id).delete ();
  }

  async addMuseo (data: any) {    
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Museos').doc (data.id).ref;
    batch.set (step_01, data);
    
    return await batch.commit ();
  }
  
  get_museos () {
    return this.afs.collection ('Museos').valueChanges ();
  }

  deleteMuseo (id: string) {
    return this.afs.collection ('Museos').doc (id).delete ();
  }

  async addParques_Arqueologicos (data: any) {    
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Parques_Arqueologicos').doc (data.id).ref;
    batch.set (step_01, data);
    
    return await batch.commit ();
  }

  get_parques_Arqueologicos () {
    return this.afs.collection ('Parques_Arqueologicos').valueChanges ();
  }

  delete_parques_Arqueologicos (id: string) {
    return this.afs.collection ('Parques_Arqueologicos').doc (id).delete ();
  }

  async addSalidaViajeProgramado (viaje: any, data: any) {
    let batch = this.afs.firestore.batch ();

    data.id = this.afs.createId ();

    const step_01 = this.afs.collection ('Viajes_Programados').doc (viaje.id).collection ("Salidas").doc (data.id).ref;
    batch.set (step_01, data);

    const step_2 = this.afs.collection ('Viajes_Programados').doc (viaje.id).ref;
    batch.update (step_2, { 
        ultimo_viaje_cupos: data.cupos,
        ultimo_viaje_fecha_salida: data.fecha_salida,
        ultimo_viaje_nro_incritos: 0,
        ultimo_viaje_nro_pendientes: 0,
        ultimo_viaje_id: data.id,
        estado: 0
    });

    return await batch.commit ();
  }

  getSalidasViajeProgramado (id: string) {
    return this.afs.collection ('Viajes_Programados').doc (id).collection ("Salidas").valueChanges ();
  }

  getViajerosBySalida (viaje_id: string, salida_id: string) {
    return this.afs.collection ('Viajes_Programados').doc (viaje_id).collection ("Salidas").doc (salida_id).collection ("Viajeros").valueChanges ();
  }

  async deleteSalidaViajeProgramado (viaje_id: string, salida_id: string) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Viajes_Programados').doc (viaje_id).collection ("Salidas").doc (salida_id).ref;
    batch.update (step_01, {
      eliminado: true
    });

    const step_2 = this.afs.collection ('Viajes_Programados').doc (viaje_id).ref;
    batch.update (step_2, { 
        ultimo_viaje_cupos: 0,
        ultimo_viaje_fecha_salida: '',
        ultimo_viaje_nro_incritos: 0,
        estado: 2
    });

    return await batch.commit ();
  }

  async eliminarSalida (item: any) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Viajes_Programados').doc (item.id).ref
    batch.update (step_01, {
      estado: 2,
      ultimo_viaje_cupos: 0,
      ultimo_viaje_nro_pendientes: 0
    });

    const step_02 = this.afs.collection ('Viajes_Programados').doc (item.id).collection ("Salidas").doc (item.ultimo_viaje_id).ref;
    batch.update (step_02, {
      eliminado: true,
      estado: 2
    });

    return await batch.commit ();
  }

  getSalidaById (viaje: any) {
    return this.afs.collection ('Viajes_Programados').doc (viaje.id).collection ("Salidas").doc (viaje.ultimo_viaje_id).valueChanges ();
  }

  async updateSalida (viaje: any, update: any) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Viajes_Programados').doc (viaje.id).ref
    batch.update (step_01, {
      ultimo_viaje_cupos: update.cupos,
      ultimo_viaje_fecha_salida: update.fecha_salida
    });

    const step_02 = this.afs.collection ('Viajes_Programados').doc (viaje.id).collection ("Salidas").doc (viaje.ultimo_viaje_id).ref;
    batch.update (step_02, update);

    return await batch.commit ();
  }

  deleteViajero (viaje: any, viajero: any) {
    return this.afs.collection ('Viajes_Programados').doc (viaje.id).collection ('Salidas').doc (viaje.ultimo_viaje_id).collection ('Viajeros').doc (viajero.dni).delete ();
  }

  /*
    Tipo de Viajes Programados
  */

  getViajesProgramadosTipos () {
    return this.afs.collection ('ViajesProgramados_Tipos', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateViajesProgramadosTipos (data: any) {
    return this.afs.collection ('ViajesProgramados_Tipos').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addViajesProgramadosTipos (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('ViajesProgramados_Tipos').doc (id).set ({
      id: id,
      nombre: data,
      
    });
  }   
  
  getCapacitaciones () {    
    return this.afs.collection ("Capacitaciones").valueChanges ();
  }

  getCapacitacionesById (id: string) {
    return this.afs.collection ("Capacitaciones").doc (id).valueChanges ();
  }

  addCapacitaciones (data: any) {
    let id = this.afs.createId ();
    
    return this.afs.collection ('Capacitaciones').doc (id).set ({
      id: id,
      nombre: data.nombre,
      date_added: new Date ().toISOString ()
    });
  }

  removeViajesProgramadosTipos (data: any) {
    return this.afs.collection ('ViajesProgramados_Tipos').doc (data.id).delete ();
  }

  getUsuarioViajeProgramado (dni: string) {
    return this.afs.collection ('Usuarios_Viajes_Programados').doc (dni).valueChanges ();
  }

  getValidViajeUsuarioViajeProgramado (dni: string, viaje_id: string) {
    return this.afs.collection ('Usuarios_Viajes_Programados').doc (dni).collection ('Viajes_Inscritos').doc (viaje_id).valueChanges ();
  }

  async addViajeroViajeProgramado (viaje: any, salida_id: string, data: any) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Usuarios_Viajes_Programados').doc (data.dni).ref;
    batch.set (step_01, data);
    
    const step_02 = this.afs.collection ('Usuarios_Viajes_Programados').doc (data.dni).collection ('Viajes_Inscritos').doc (viaje.id).ref;    
    batch.set (step_02, {
      id: viaje.id,
      nombre: viaje.nombre,
      ultima_salida: salida_id
    });

    const step_03 = this.afs.collection ('Usuarios_Viajes_Programados').doc (data.dni).collection ('Viajes_Inscritos').doc (viaje.id).collection ('Salidas').doc (salida_id).ref;    
    batch.set (step_03, {
      id: salida_id,
      checked: true
    });

    const step_04 = this.afs.collection ('Viajes_Programados').doc (viaje.id).collection ("Salidas").doc (salida_id).collection ('Viajeros').doc (data.dni).ref;
    batch.set (step_04, {
      nombre_completo: data.nombre_completo,
      dni: data.dni,
      checked: true,
      fecha_nacimiento: data.fecha_nacimiento,
      fecha_agregado: new Date ().toISOString (),
      correo: data.correo
    });

    return await batch.commit ();
  }

  async addUsuarioViajeProgramado (data: any, viaje: any, salida_id: string) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Viajes_Programados').doc (viaje.id).collection ("Salidas").doc (salida_id).collection ('Viajeros').doc (data.dni).ref;
    batch.set (step_01, {
      nombre_completo: data.nombre_completo,
      dni: data.dni,
      checked: true,
      fecha_nacimiento: data.fecha_nacimiento,
      fecha_agregado: new Date ().toISOString (),
      correo: data.correo
    });

    const step_02 = this.afs.collection ('Usuarios_Viajes_Programados').doc (data.dni).collection ('Viajes_Inscritos').doc (viaje.id).ref;    
    batch.set (step_02, {
      id: viaje.id,
      nombre: viaje.nombre,
      ultima_salida: salida_id
    });

    const step_03 = this.afs.collection ('Usuarios_Viajes_Programados').doc (data.dni).collection ('Viajes_Inscritos').doc (viaje.id).collection ('Salidas').doc (salida_id).ref;    
    batch.set (step_03, {
      id: salida_id,
      checked: true
    });

    return await batch.commit ();
  }

  async addUsuarioSancion (data: any, viaje: any, salida_id: string) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Viajes_Programados').doc (viaje.id).collection ("Salidas").doc (salida_id).collection ('Viajeros').doc (data.dni).ref;
    batch.update (step_01, {
      checked: false
    });

    const step_02 = this.afs.collection ('Usuarios_Viajes_Programados').doc (data.dni).ref
    batch.update (step_02, {
      estado: false
    });
    
    const step_03 = this.afs.collection ('Usuarios_Viajes_Programados').doc (data.dni).collection ('Viajes_Inscritos').doc (viaje.id).collection ('Salidas').doc (salida_id).ref
    batch.update (step_03, {
      checked: false
    });

    return await batch.commit ();
  }

  async removeUsuarioSancion (data: any, viaje: any, salida_id: string) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Viajes_Programados').doc (viaje.id).collection ("Salidas").doc (salida_id).collection ('Viajeros').doc (data.dni).ref;
    batch.update (step_01, {
      checked: true
    });

    const step_02 = this.afs.collection ('Usuarios_Viajes_Programados').doc (data.dni).ref
    batch.update (step_02, {
      estado: true
    });

    const step_03 = this.afs.collection ('Usuarios_Viajes_Programados').doc (data.dni).collection ('Viajes_Inscritos').doc (viaje.id).collection ('Salidas').doc (salida_id).ref
    batch.update (step_03, {
      checked: true
    });

    return await batch.commit ();
  }

  async cerrarViaje (viaje_id: string, salida_id: string) {
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Viajes_Programados').doc (viaje_id).ref
    batch.update (step_01, {
      estado: 2
    });

    const step_02 = this.afs.collection ('Viajes_Programados').doc (viaje_id).collection ("Salidas").doc (salida_id).ref;
    batch.update (step_02, {
      estado: 1
    });

    return await batch.commit ();
  }

  getSalidasByUsuarioViajeRealizados (dni: string, viaje_id:string) {
    return this.afs.collection ('Usuarios_Viajes_Programados').doc (dni).collection ('Viajes_Inscritos').doc (viaje_id).collection ('Salidas').valueChanges ();
  }

  async addViajeroForzadoViajeProgramado (salida_id: string, usuario_viaje: any) {
    let batch = this.afs.firestore.batch ();

    let viaje = usuario_viaje.viaje;
    viaje.ultima_salida = salida_id;
    
    const step_01 = this.afs.collection ('Viajes_Programados').doc (viaje.id).collection ("Salidas").doc (salida_id).collection ('Viajeros').doc (usuario_viaje.usuario.dni).ref;
    batch.set (step_01, {
      nombre_completo: usuario_viaje.usuario.nombre_completo,
      dni: usuario_viaje.usuario.dni,
      checked: true,
      fecha_nacimiento: usuario_viaje.usuario.fecha_nacimiento,
      fecha_agregado: new Date ().toISOString (),
      correo: usuario_viaje.usuario.correo
    });

    const step_02 = this.afs.collection ('Usuarios_Viajes_Programados').doc (usuario_viaje.usuario.dni).collection ('Viajes_Inscritos').doc (viaje.id).ref;    
    batch.set (step_02, viaje);

    const step_03 = this.afs.collection ('Usuarios_Viajes_Programados').doc (usuario_viaje.usuario.dni).collection ('Viajes_Inscritos').doc (viaje.id).collection ('Salidas').doc (salida_id).ref;    
    batch.set (step_03, {
      id: salida_id,
      checked: true
    });

    return await batch.commit ();
  }

  getUsuarioViajesRealizados (dni: string) {
    const collection = this.afs.collection ('Usuarios_Viajes_Programados').doc (dni).collection ('Viajes_Inscritos');

    return collection.snapshotChanges ().pipe (map (refReferencias => {
      if (refReferencias.length > 0) {
        return refReferencias.map (refReferencia => {
          const data: any = refReferencia.payload.doc.data();

          return this.getSalidasByUsuarioViajeRealizados (dni, data.id).pipe (map (salidas => Object.assign ({}, { data, salidas })));
        });
      }
    })).mergeMap (observables => {
      if (observables) {
        return combineLatest(observables);
      } else {
        return of([]);
      }
    });
  }

  getViajesProgramadosHistorial (viaje_id: string) {
    return this.afs.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').valueChanges ();
  }

  getSalidasViaje (viaje_id: string, salida_id: string) {
    return this.afs.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id).collection ('Viajeros').valueChanges ();
  }

  updateCapacitaciones (data: any) {
    return this.afs.collection ('Capacitaciones').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  removeCapacitaciones (data: any) {
    return this.afs.collection ('Capacitaciones').doc (data.id).delete ();
  }

  /* CRUD Asuntos */

  getAsuntos () {    
    return this.afs.collection ("Asuntos").valueChanges ();
  }

  getAsuntoById (id: string) {
    return this.afs.collection ("Asuntos").doc (id).valueChanges ();
  }

  addAsuntos (data: any) {
    let id = this.afs.createId ();
    return this.afs.collection ('Asuntos').doc (id).set ({
      id: id,
      nombre: data.nombre,
      date_added: new Date ().toISOString ()
    });
  }

  updateAsuntos (data: any) {
    return this.afs.collection ('Asuntos').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  removeAsuntos (data: any) {
    return this.afs.collection ('Asuntos').doc (data.id).delete ();
  }

  /* CRUD Solicitante y otra coleccion con sus -> Solicitudes */

  getSolicitantes () {    
    return this.afs.collection ("Solicitante").valueChanges ();
  }

  getSolicitanteById (id: any) {
    return this.afs.collection ("Solicitante").doc (id).valueChanges ();
  }

  getSolicitudById (id: string) {
    return this.afs.collection ("Solicitudes").doc (id).valueChanges ();
  }

  getContactoByIdSolicitud (id: string) {
    return this.afs.collection ('Solicitudes').doc (id).collection ('Detalle').doc (id).valueChanges ();
  }

  addSolicitante (data: any) {
    return this.afs.collection ('Solicitante').doc (data.n_doc).set (data);
  }

  addSolicitud (data: any) {
    return this.afs.collection ('Solicitudes').doc (data.id).set (data);
  }

  addDetalleContacto (id:string, data: any) {
    return this.afs.collection ('Solicitudes').doc (id).collection ('Detalle').doc (id).set (data);
  }

   async addEntregaSolicitud (id:string, data: any, data2: any) {


    let batch = this.afs.firestore.batch ();
    
    const pp1 = this.afs.collection ('Solicitudes').doc (id).ref;
    batch.update (pp1, {
      estado: data2.estado,
      monto: data2.monto,
      fecha_entregado: data2.fecha_entregado
    });
    const pp2 = this.afs.collection ('Solicitudes').doc (id).collection ('Detalle').doc (id).ref;
    batch.update (pp2, {
      data
    });
   

    return await batch.commit ();
  }


  updateSolicitante (data: any) {
    return this.afs.collection ('Solicitante').doc (data.n_doc).update (data);
  }

  updateEstadoSolicitud (data: any, estado: number) {
    return this.afs.collection ('Solicitudes').doc (data.id).update ({
      estado: estado,
      fecha_aprobacion: new Date ().toISOString ()
    });
  }

  async updateEstadoSolicitudRechazado (data: any, obj: any) {


    let batch = this.afs.firestore.batch ();
    
    const pp1 = this.afs.collection ('Solicitudes').doc (data.id).ref;
    batch.update (pp1, {
      estado: obj.estado,
      fecha_rechazado: new Date ().toISOString ()
    });
    const pp2 = this.afs.collection ('Solicitudes').doc (data.id).collection ('Detalle').doc (data.id).ref;
    batch.update (pp2, {
      observacion_rechazo: obj.observacion_rechazo,
    });
   

    return await batch.commit ();
  }



  removeSolicitante (data: any) {
    return this.afs.collection ('Solicitante').doc (data.id).delete ();
  }

  getProcesarSolicitudes () {
    /* Solicitudes Filtradas por el estado 0 y 1 para mostrar en procesar solicitudes  */
    return this.afs.collection('Solicitudes', ref => ref.where('estado', '<=' , 1)).valueChanges();
  }
  getFiltrarAnoMesSolicitudes (ano:string, mes:string) {
    /* Filtrar solicitudes por mes y año */
    return this.afs.collection('Solicitudes', ref => ref.where('ano', '==' , ano).where('mes', '==' , mes)).valueChanges();
  }
  getSolicitudesByIdSolicitante (id: string) {
    return this.afs.collection('Solicitudes', ref => ref.where('id_solicitante', '==' , id)).valueChanges();
  }

  getSolicitantesByDistritos (id1: string, id2: string) {
    /* Solicitante  */
    return this.afs.collection('Solicitante', ref => ref.where('provincia.id', '==', id1).where('distrito.id','==', id2)).valueChanges();
  }

  getSolicitudesBySolicitante (id_solicitante: string) {
    return this.afs.collection('Solicitudes', ref => ref.where('id_solicitante', '==', id_solicitante)).valueChanges();
  }

  /* Consultas para el filtro de solicitudes */
  
  getSolicitudesByDistritos (id1: string, id2: string) {
    return this.afs.collection('Solicitudes', ref => ref.where('provincia.id', '==', id1).where('distrito.id','==', id2)).valueChanges();
  }

  getSolicitudesByDistritosAndEstado (id1: string, id2: string, estado_solicitud:number) {
    return this.afs.collection('Solicitudes', ref => ref.where('provincia.id', '==', id1).where('distrito.id','==', id2).where('estado','==', estado_solicitud)).valueChanges();
  }

  getSolicitudesByDistritosAndTipo (id1: string, id2: string, id3:string) {
    return this.afs.collection('Solicitudes', ref => ref.where('provincia.id', '==', id1).where('distrito.id','==', id2).where('capacitacion.id','==', id3)).valueChanges();
  }

  getSolicitudesByDistritosAndEstadoAndTipo (id1: string, id2: string, estado_solicitud:number, id3:string) {
    return this.afs.collection('Solicitudes', ref => ref.where('provincia.id', '==', id1).where('distrito.id','==', id2).where('estado','==', estado_solicitud).where('capacitacion.id','==', id3)).valueChanges();
  }

  /* Reporte General */ 

  getEstadisticasSolicitudesProvincias (id_provincia: string) {
    return this.afs.collection ('Estadisticas_Solicitudes_Provincias').doc (id_provincia).valueChanges ();
  }

  getEstadisticaSolicitudesProvincia () {

      const collection = this.afs.collection ("Provincias");
                                                                                                                                                                                                                                      
      return collection.snapshotChanges ().pipe (map (refReferencias => {
        if (refReferencias.length > 0) {
          return refReferencias.map (refReferencia => {
            const data: any = refReferencia.payload.doc.data();
  
            return this.getEstadisticasSolicitudesProvincias (data.id).pipe (map (datageneral => Object.assign ({}, {data, datageneral})));
          });
        }
      })).mergeMap (observables => {
        if (observables) {
          return combineLatest(observables);
        } else {
          return of([]);
        }
      });
    
  }

  getEstadisticasSolicitudesDistritos (id_distrito: string) {
    return this.afs.collection ('Estadisticas_Solicitudes_Distritos').doc (id_distrito).valueChanges ();
  }

  getEstadisticaSolicitudesDistritos (id_provincia: string) {

    const collection = this.afs.collection ("Provincias").doc (id_provincia).collection ("Distritos");
                                                                                                                                                                                                                                      
    return collection.snapshotChanges ().pipe (map (refReferencias => {
      if (refReferencias.length > 0) {
        return refReferencias.map (refReferencia => {
          const data: any = refReferencia.payload.doc.data();

          return this.getEstadisticasSolicitudesDistritos (data.id).pipe (map (datageneral => Object.assign ({}, {data, datageneral})));
        });
      }
    })).mergeMap (observables => {
      if (observables) {
        return combineLatest(observables);
      } else {
        return of([]);
      }
    });

  }

  getSolicitudesXProvinciaAnoMes (id_provincia: string, ano: string, mes: string) {
    /* Filtramos las solicitudes por el id de la provincia seguido del año y mes y del estado 2  */
    return this.afs.collection('Solicitudes', ref => ref.where('estado', '==' , 2).where('provincia.id', '==' , id_provincia).where('ano', '==' , ano).where('mes', '==' , mes)).valueChanges();
  }

  getSolicitudesXDistritosAnoMes (id_distrito: string, ano: string, mes: string) {
    /* Filtramos las solicitudes por el id del distrito seguido del año y mes y del estado 2  */
    return this.afs.collection('Solicitudes', ref => ref.where('estado', '==' , 2).where('distrito.id', '==' , id_distrito).where('ano', '==' , ano).where('mes', '==' , mes)).valueChanges();
  }

  // Trasnaparencia Categoria
  getTransparenciaCategorias () {
    return this.afs.collection ('TransparenciaCategorias', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  getTransparenciaSubCategorias (categoria_id: string) {
    return this.afs.collection ('TransparenciaCategorias').doc (categoria_id).collection ('Subcategorias').snapshotChanges ().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  addTransparenciaSubcategoria (categoria_id: string, nombre: string) {
    let id = this.createId ();
    return this.afs.collection ('TransparenciaCategorias').doc (categoria_id).collection ('Subcategorias').doc (id).set ({
      id: id,
      nombre: nombre
    });
  }

  updateTransparenciaCategoria (data: any) {
    return this.afs.collection ('TransparenciaCategorias').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  updateTransparenciaSubCategoria (id: string, data: any) {
    return this.afs.collection ('TransparenciaCategorias').doc (id).collection ('Subcategorias').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addTransparenciaCategoria (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('TransparenciaCategorias').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeTransparenciaCategoria (data: any) {
    return this.afs.collection ('TransparenciaCategorias').doc (data.id).delete ();
  }

  removeTransparenciaSubCategoria (sub_id: string, data: any) {
    return this.afs.collection ('TransparenciaCategorias').doc (sub_id).collection ('Subcategorias').doc (data.id).delete ();
  }

  getSubCategoriasByCategoria (c_id: string) {
    return this.afs.collection ('TransparenciaCategorias').doc (c_id).collection ('Subcategorias').valueChanges ();
  }

  // Transparencia Medios
  add_transparencia_medio (data: any) {
    return this.afs.collection ("Transparencia_Medios").doc (data.id).set (data);
  }

  getTransparenciaMedios () {
    return this.afs.collection ("Transparencia_Medios").valueChanges ();
  }

  remove_transparencia_medio (data: any) {
    return this.afs.collection ("Transparencia_Medios").doc (data.id).delete ();
  }

  update_transparencia_medio (data: any) {
    return this.afs.collection ("Transparencia_Medios").doc (data.id).update (data);
  }

  async subir_restaurantes_script (list: any []) {
    let batch = this.afs.firestore.batch ();

    list.forEach ((centro: any) => {
      batch.set (
        this.afs.collection ('Restaurantes').doc (centro.id).ref,
        centro
      )
    });

    return await batch.commit ();
  }

  async subir_guias_script (list: any [], centros_formacion: any [], coles: any [], idioms: any []) {
    let batch = this.afs.firestore.batch ();

    centros_formacion.forEach ((centro: any) => {
      batch.set (
        this.afs.collection ('Guia_Centro_Formacion').doc (centro.id).ref,
        centro
      )
    });

    coles.forEach ((centro: any) => {
      batch.set (
        this.afs.collection ('Guia_Asociacion_Colegio').doc (centro.id).ref,
        centro
      )
    });

    idioms.forEach ((centro: any) => {
      batch.set (
        this.afs.collection ('Guia_Idiomas').doc (centro.id).ref,
        centro
      )
    });

    list.forEach ((centro: any) => {
      batch.set (
        this.afs.collection ('Guias').doc (centro.id).ref,
        centro
      )
    });

    return await batch.commit ();
  }

  get_rechazos_tipo (tipo: string) {
    return this.afs.collection ('Prestadores_Rechazados_Ref', ref => ref.where ('tipo', '==', tipo).orderBy ('fecha')).valueChanges ();
  }
}