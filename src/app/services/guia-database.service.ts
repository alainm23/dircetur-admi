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
export class GuiaDatabaseService {

  constructor(private afs: AngularFirestore) {}

  /*
    Guias
  */
 
  async addGuia (data: any) {
    data.id = this.afs.createId ();
    
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Guias').doc (data.id).ref;

    batch.set (step_01, data);
    
    return await batch.commit ();  
  }

  getGuia_Idiomas () {
    return this.afs.collection ('Guia_Idiomas').snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let checked = false;
          const id = a.payload.doc.id;
          return { id, checked, ...data };
      });
    });
  }

  getGuia_Tipo_Guiado () {
    return this.afs.collection ('Guia_Tipo_Guiado').snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let checked = false;
          const id = a.payload.doc.id;
          return { id, checked, ...data };
      });
    });
  }

  getGuiasByDistritos (id1: string, id2: string) {
    return this.afs.collection ("Provincias").doc (id1).collection ("Distritos").doc (id2).collection ("Lista_Guias").valueChanges ();
  }

  getGuiaById (id: string) {
    return this.afs.collection ('Guias').doc (id).valueChanges ();
  }

  updateGuia (data: any) {
    return this.afs.collection ('Guias').doc (data.id).update (data);
  }

  /*
    Idiomas
  */

  getGuia_Idiomas2 () {
    return this.afs.collection ('Guia_Idiomas', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateGuia_Idiomas (data: any) {
    return this.afs.collection ('Guia_Idiomas').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addGuia_Idiomas (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('Guia_Idiomas').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeGuia_Idiomas (data: any) {
    return this.afs.collection ('Guia_Idiomas').doc (data.id).delete ();
  }

  /*
    Asociacion o colegios
  */

  getGuia_Asociacion_Colegio () {
    return this.afs.collection ('Guia_Asociacion_Colegio', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data: any = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateGuia_Asociacion_Colegio (data: any) {
    return this.afs.collection ('Guia_Asociacion_Colegio').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addGuia_Asociacion_Colegio (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('Guia_Asociacion_Colegio').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeGuia_Asociacion_Colegio (data: any) {
    return this.afs.collection ('Guia_Asociacion_Colegio').doc (data.id).delete ();
  }

  /*
    Centro de formacion
  */

  getGuia_Centro_Formacion () {
    return this.afs.collection ('Guia_Centro_Formacion', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateGuia_Centro_Formacion (data: any) {
    return this.afs.collection ('Guia_Centro_Formacion').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addGuia_Centro_Formacion (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('Guia_Centro_Formacion').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeGuia_Centro_Formacion (data: any) {
    return this.afs.collection ('Guia_Centro_Formacion').doc (data.id).delete ();
  }

  /*
    Tipos de Guiado
  */

  getGuia_Tipo_Guiado2 () {
    return this.afs.collection ('Guia_Tipo_Guiado', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateGuia_Tipo_Guiado (data: any) {
    return this.afs.collection ('Guia_Tipo_Guiado').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addGuia_Tipo_Guiado (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('Guia_Tipo_Guiado').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });  
  }

  removeGuia_Tipo_Guiado (data: any) {
    return this.afs.collection ('Guia_Tipo_Guiado').doc (data.id).delete ();
  }

  getByDistritos (distrito_id: string) {
    return this.afs.collection ("Guias", ref => ref.where ('distrito.id', '==', distrito_id)).valueChanges ();
  }

  getByProvincias (provincia_id: string) {
    return this.afs.collection ("Guias", ref => ref.where ('provincia.id', '==', provincia_id)).valueChanges ();
  }
}
