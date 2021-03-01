import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { first, map } from 'rxjs/operators';
import { combineLatest, of } from "rxjs";
import * as firebase from 'firebase/app'; 
import 'firebase/firestore';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AgenciaDatabaseService {
  items: any [] = [];
  URL_API: string;
  constructor(private afs: AngularFirestore, public http: HttpClient) {
    this.URL_API = 'https://api-dirceturcuscoapp.web.app/api/v1/';
  }

  get_certificado (id: string) {
    return this.http.get (this.URL_API + 'get_certificado/agencia' + '/' + id);
  }

  createId () {
    return this.afs.createId ();
  }

  async addAgencia (data: any, representantes: any []) {
    data.id = this.afs.createId ();
    
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Agencias').doc (data.id).ref;

    batch.set (step_01, data);

    representantes.forEach ((r) => {
      let step = this.afs.collection ('Agencias').doc (data.id).collection ('Socios').doc (r.id).ref;
      batch.set (step, r);
    });
    
    return await batch.commit ();  
  }

  async eliminar_agencia (item: any, eliminar_correo_ruc: boolean) {
    let batch = this.afs.firestore.batch ();

    batch.delete (this.afs.collection ('Agencias').doc (item.id).ref);
    if (eliminar_correo_ruc) {
      batch.delete (this.afs.collection ('Correos_Usados').doc (item.correo).ref);
      batch.delete (this.afs.collection ('RUC_Usados').doc (item.representante_ruc.toString ()).ref);
    }
    
    return await batch.commit ();
  }

  async updateAgencia (data: any, representantes: any []) {
    let batch = this.afs.firestore.batch ();
    const step_01 = this.afs.collection ("Agencias").doc (data.id).ref;
    batch.update (step_01, data);

    representantes.forEach ((r: any) => {
      if (r.id === "" || r.id === undefined || r.id === null) {
        r.id = this.createId ();

        let stepx = this.afs.collection ('Agencias').doc (data.id).collection ("Socios").doc (r.id).ref;
        batch.set (stepx, r);
      } else {
        let stepx = this.afs.collection ('Agencias').doc (data.id).collection ("Socios").doc (r.id).ref;
        batch.update (stepx, r);
      }
    });

    return await batch.commit ();
  }

  getAgenciaRepresentantes (id: string) {
    return this.afs.collection ('Agencias').doc (id).collection ('Socios').valueChanges ();
  }

  getAgencia (id: string) {
    return this.afs.collection ('Agencias').doc (id).valueChanges ();
  }

  getAgenciasByDistritos (distrito_id: string) {
    return this.afs.collection ("Agencias", ref => ref.where ('distrito.id', '==', distrito_id).where ('aprobado', '==', true)).valueChanges ();
  }

  getAgenciasByProvincias (provincia_id: string) {
    return this.afs.collection ("Agencias", ref => ref.where ('provincia.id', '==', provincia_id).where ('aprobado', '==', true)).valueChanges ();
  }
  
  getAllAgencias () {
    return this.afs.collection ('Agencias').valueChanges ();
  }
  
  /*
    CRUD Clasificaciones
  */

  getAgenciaTipo_Clasificaciones () {
    return this.afs.collection ('AgenciaTipo_Clasificaciones', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }
  
  updateAgenciaTipo_Clasificaciones (data: any) {
    return this.afs.collection ('AgenciaTipo_Clasificaciones').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addAgenciaTipo_Clasificaciones (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('AgenciaTipo_Clasificaciones').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }
  
  removeAgenciaTipo_Clasificaciones (data: any) {
    return this.afs.collection ('AgenciaTipo_Clasificaciones').doc (data.id).delete ();
  }
  
  /*
    CRUD Modalidad Turismo
  */

  getModalidad_Turismo () { 
    return this.afs.collection ('Modalidad_Turismo', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let checked = false;
          const id = a.payload.doc.id;
          return { id, checked, ...data };
      });
    });
  }

  updateModalidad_Turismo (data: any) {
    return this.afs.collection ('Modalidad_Turismo').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addModalidad_Turismo (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('Modalidad_Turismo').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeModalidad_Turismo (data: any) {
    return this.afs.collection ('Modalidad_Turismo').doc (data.id).delete ();
  }

  /*
    Tipos de turismo
  */

  getTipos_Turismo () {
    return this.afs.collection ('Tipos_Turismo').snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let checked = false;
          const id = a.payload.doc.id;
          return { id, checked, ...data };
      });
    });
  
  }

  addAgenciaReconocimiento (id: string, data: any) {
    data.id = this.createId ();

    return this.afs.collection ('Agencias').doc (id).collection ('Reconocimientos').doc (data.id).set (data);
  }

  getAgenciaReconocimientos (id: string) {
    return this.afs.collection ('Agencias').doc (id).collection ('Reconocimientos').valueChanges ();
  }

  addAgenciaSancion (id: string, data: any) {
    data.id = this.createId ();

    return this.afs.collection ('Agencias').doc (id).collection ('Sanciones').doc (data.id).set (data);
  }

  getAgenciaSanciones (id: string) {
    return this.afs.collection ('Agencias').doc (id).collection ('Sanciones').valueChanges ();
  }

  updateSancion (agencia_id: string, sancion: any, nuevo_dato: string) {
    return this.afs.collection ('Agencias').doc (agencia_id).collection ('Sanciones').doc (sancion.id).update ({
      estado: 'Resuelto',
      resuelto_texto: nuevo_dato
    });
  }

  get_agencias_para_revisar () {
    return this.afs.collection ("Agencias", ref => ref.where ('aprobado', '==', false)).valueChanges ();
  }

  aprobar (item: any, password: string) {
    let update: any = {};
    update ['aprobado'] = true;
    update ['password'] = password
    update ['fecha_aprobado'] = moment ().format ('DD[-]MM[-]YYYY');
    return this.afs.collection ("Agencias").doc (item.id).update (update);
  }

  async rechazar_agencia (item: any) {
    let batch = this.afs.firestore.batch ();

    batch.update (this.afs.collection ("Agencias").doc (item.id).ref, {
      rechazado: true,
      rechazo_motivo: item.rechazo_motivo
    });

    const id = this.createId ();
    batch.set (this.afs.collection ('Prestadores_Rechazados_Ref').doc (id).ref, {
      id: id,
      ruc: item.representante_ruc,
      nombre: item.nombre_comercial,
      fecha: moment ().format ('DD[-]MM[-]YYYY'),
      motivo: item.rechazo_motivo,
      correo: item.correo,
      tipo: 'Agencias'
    });

    return await batch.commit ();
  }
}
