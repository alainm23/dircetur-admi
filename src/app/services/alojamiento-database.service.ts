import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { first, map } from 'rxjs/operators';
import { combineLatest, of } from "rxjs";
import * as firebase from 'firebase/app'; 
import 'firebase/firestore';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AlojamientoDatabaseService {
  URL_API: string;
  constructor(private afs: AngularFirestore, public http: HttpClient) {
    this.URL_API = 'https://api-dirceturcuscoapp.web.app/api/v1/';
  }

  get_certificado (id: string) {
    return this.http.get (this.URL_API + 'get_certificado/alojamiento' + '/' + id);
  }

  createId () {
    return this.afs.createId ();
  }

  async eliminar (item: any, eliminar_correo_ruc: boolean) {
    let batch = this.afs.firestore.batch ();

    batch.delete (this.afs.collection ('Alojamientos').doc (item.id).ref);

    if (eliminar_correo_ruc) {
      batch.delete (this.afs.collection ('Correos_Usados').doc (item.correo).ref);
      batch.delete (this.afs.collection ('RUC_Usados').doc (item.ruc.toString ()).ref);
    }

    return await batch.commit ();
  }

  async addHotel (data: any, representantes: any []) {
    data.id = this.afs.createId ();
    
    let batch = this.afs.firestore.batch ();

    const step_01 = this.afs.collection ('Alojamientos').doc (data.id).ref;

    batch.set (step_01, data);

    representantes.forEach ((r) => {
      r.id = this.afs.createId ();
      delete r._id;

      let step = this.afs.collection ('Alojamientos').doc (data.id).collection ('Socios').doc (r.id).ref;
      batch.set (step, r);
    });
    
    return await batch.commit ();  
  }

  async updateHotel (data: any, representantes: any []) {
    let batch = this.afs.firestore.batch ();
    const step_01 = this.afs.collection ("Alojamientos").doc (data.id).ref;
    batch.update (step_01, data);

    representantes.forEach ((r: any) => {
      if (r.id === "" || r.id === undefined || r.id === null) {
        r.id = this.createId ();

        let stepx = this.afs.collection ('Alojamientos').doc (data.id).collection ("Representantes").doc (r.id).ref;
        batch.set (stepx, r);
      } else {
        let stepx = this.afs.collection ('Alojamientos').doc (data.id).collection ("Representantes").doc (r.id).ref;
        batch.update (stepx, r);
      }
    });

    return await batch.commit ();
  }

  getHotelRepresentantes (id: string) {
    return this.afs.collection ('Alojamientos').doc (id).collection ('Representantes').valueChanges ();
  }

  getHotel (id: string) {
    return this.afs.collection ('Alojamientos').doc (id).valueChanges ();
  }

  getHotelByDistritos (id1: string, id2: string) {
    return this.afs.collection ("Provincias").doc (id1).collection ("Distritos").doc (id2).collection ("Lista_Alojamientos").valueChanges ();
  }

  /*
    Hotel Tios
  */

  getHotelTipo_Clasificaciones () {
    return this.afs.collection ('HotelTipo_Clasificaciones', ref => ref.orderBy ('date_added')).snapshotChanges().map(changes => {
      return changes.map(a => {
          const data = a.payload.doc.data();
          let edit = false;
          const id = a.payload.doc.id;
          return { id, edit, ...data };
      });
    });
  }

  updateHotelTipo_Clasificaciones (data: any) {
    return this.afs.collection ('HotelTipo_Clasificaciones').doc (data.id).update ({
      nombre: data.name
    });
  }

  addHotelTipo_Clasificaciones (data: any) {
    let id = this.afs.createId ();

    return this.afs.collection ('HotelTipo_Clasificaciones').doc (id).set ({
      id: id,
      nombre: data,
      date_added: new Date ().toISOString ()
    });
  }

  removeHotelTipo_Clasificaciones (data: any) {
    return this.afs.collection ('HotelTipo_Clasificaciones').doc (data.id).delete ();
  }

  getByDistritos (distrito_id: string) {
    return this.afs.collection ("Alojamientos", ref => ref.where ('distrito.id', '==', distrito_id).where ('aprobado', '==', true)).valueChanges ();
  }

  getByProvincias (provincia_id: string) {
    return this.afs.collection ("Alojamientos", ref => ref.where ('provincia.id', '==', provincia_id).where ('aprobado', '==', true)).valueChanges ();
  }

  get_alojamientos_para_revisar () {
    return this.afs.collection ("Alojamientos", ref => ref.where ('aprobado', '==', false)).valueChanges ();
  }

  aprobar (item: any, password: string) {
    let update: any = {};
    update ['aprobado'] = true;
    update ['password'] = password
    update ['fecha_aprobado'] = moment ().format ('DD[-]MM[-]YYYY');
    return this.afs.collection ("Alojamientos").doc (item.id).update (update);
  }

  async rechazar (item: any) {
    let batch = this.afs.firestore.batch ();

    batch.update (this.afs.collection ("Alojamientos").doc (item.id).ref, {
      rechazado: true,
      rechazo_motivo: item.rechazo_motivo
    });

    const id = this.createId ();
    batch.set (this.afs.collection ('Prestadores_Rechazados_Ref').doc (id).ref, {
      id: id,
      ruc: item.ruc,
      nombre: item.nombre_comercial,
      fecha: moment ().format ('DD[-]MM[-]YYYY'),
      motivo: item.rechazo_motivo,
      correo: item.correo,
      tipo: 'Alojamientos'
    });

    return await batch.commit ();
  }
}
