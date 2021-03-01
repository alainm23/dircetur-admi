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
export class RestauranteDatabaseService {

  constructor(private afs: AngularFirestore) {}

  createId () {
    return this.afs.createId ();
  }
  
  /*
    Restaurantes
  */

  getRestaurante_Clasificaciones () {
    return this.afs.collection ('Restaurante_Clasificaciones').valueChanges ();
  }

  getRestaurante_Categorias () {
    return this.afs.collection ('Restaurante_Categorias').valueChanges ();
  }

  async addRestaurante (data: any, socios: any []) {
    data.id = this.afs.createId ();
    
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Restaurantes').doc (data.id).ref;

    batch.set (step_01, data);

    socios.forEach ((r) => {
      r.id = this.afs.createId ();
      delete r._id;

      let step = this.afs.collection ('Restaurantes').doc (data.id).collection ('Socios').doc (r.id).ref;
      batch.set (step, r);
    });
    
    return await batch.commit ();  
  }

  getRestauranteById (id: string) {
    return this.afs.collection ("Restaurantes").doc (id).valueChanges ();
  }

  getRestauranteByDistritos (id1: string, id2: string) {
    return this.afs.collection ("Provincias").doc (id1).collection ("Distritos").doc (id2).collection ("Lista_Restaurantes").valueChanges ();
  }

  getRestauranteRepresentantes (id: string) {
    return this.afs.collection ('Restaurantes').doc (id).collection ('socios').valueChanges ();
  }

  async updateRestaurante (data: any, socios: any []) {
    let batch = this.afs.firestore.batch ();
    const step_01 = this.afs.collection ("Restaurantes").doc (data.id).ref;
    batch.update (step_01, data);

    socios.forEach ((r: any) => {
      if (r.id === "" || r.id === undefined || r.id === null) {
        r.id = this.createId ();

        let stepx = this.afs.collection ('Restaurantes').doc (data.id).collection ("socios").doc (r.id).ref;
        batch.set (stepx, r);
      } else {
        let stepx = this.afs.collection ('Restaurantes').doc (data.id).collection ("socios").doc (r.id).ref;
        batch.update (stepx, r);
      }
    });

    return await batch.commit ();
  }

  /*
    Restaitantes Clasificacinones
  */

  getRestaurante_Clasificaciones2 () {
    return this.afs.collection ('Restaurante_Clasificaciones', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateRestaurante_Clasificaciones (data: any) {
    return this.afs.collection ('Restaurante_Clasificaciones').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addRestaurante_Clasificaciones (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('Restaurante_Clasificaciones').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeRestaurante_Clasificaciones (data: any) {
    return this.afs.collection ('Restaurante_Clasificaciones').doc (data.id).delete ();
  }

  /* 
    Restaurantes Categorias
  */

  getRestaurante_Categorias2 () {
    return this.afs.collection ('Restaurante_Categorias', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateRestaurante_Categorias (data: any) {
    return this.afs.collection ('Restaurante_Categorias').doc (data.id).update ({
      nombre: data.nombre
    });
  }

  addRestaurante_Categorias (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('Restaurante_Categorias').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeRestaurante_Categorias (data: any) {
    return this.afs.collection ('Restaurante_Categorias').doc (data.id).delete ();
  }

  getByDistritos (distrito_id: string) {
    return this.afs.collection ("Restaurantes", ref => ref.where ('distrito.id', '==', distrito_id)).valueChanges ();
  }

  getByProvincias (provincia_id: string) {
    return this.afs.collection ("Restaurantes", ref => ref.where ('provincia.id', '==', provincia_id)).valueChanges ();
  }
}
