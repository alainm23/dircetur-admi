import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as moment from 'moment';
import * as algoliasearch from 'algoliasearch';

// PDF
const pdfkit = require("pdfkit");
const { Base64Encode } = require('base64-stream');

const env = functions.config ();
admin.initializeApp (env.firebase);

const nodemailer = require ('nodemailer');
const cors = require ('cors');
const fs = require ("fs");
const path = require ('path');

// Initialize the Algolia Client
const client = algoliasearch (env.algolia.appid, env.algolia.apikey);
const index = client.initIndex ('dircetur');

// Init QR LIB
const qr_code = require('qrcode');

// Init API
const app = express ();
app.use (cors ({ origin: true }));

const main = express ();

main.use ('/api/v1', app);
main.use (bodyParser.json()); // support json encoded bodies
main.use (bodyParser.urlencoded({ extended: true })); // support encoded bodies

const transporter = nodemailer.createTransport ({
    service: 'gmail',
    auth: {
        user: 'dirceturapp@gmail.com',
        pass: 'sjrwxsgfigyzxivo'
    }
});

moment.locale ('es');

export const webApi = functions.https.onRequest (main);

const db = admin.firestore();

// Agencias
exports.addAgenciaAlgolia = functions.firestore.document ('Agencias/{id}').onCreate ((snapshot: any, context: any) => {
  if (snapshot.data ().aprobado === true) {
    const data: any = {
      'nombre': snapshot.data ().nombre_comercial,
      'ruc': snapshot.data ().ruc,
      'razon_social': snapshot.data ().razon_social,
      'tipo': 'agencia'
    };
    const objectID = snapshot.id;
  
    return index.addObject({
      objectID,
      ...data
    });
  }

  return 0;
});

exports.deleteAgenciaAlgolia = functions.firestore.document ('Agencias/{id}').onDelete ((snapshot: any, context: any) => {
  const data = snapshot.data ();
  return index.deleteObject (data.id);
});

exports.addAgenciaAlgoliaAprobado = functions.firestore.document ('Agencias/{id}').onUpdate ((snapshot: any, context: any) => {
  const data_before: any = snapshot.before.data ();  
  const data: any = snapshot.after.data ();

  if (data_before.aprobado !== data.aprobado && data.aprobado === true) {
    const request: any = {
      'nombre': data.nombre_comercial,
      'tipo': 'agencia'
    };
    const objectID = data.id;
  
    return index.addObject({
      objectID,
      ...request
    });
  }

  return 0;
});

exports.addAgencia = functions.firestore.document ('Agencias/{id}').onCreate ((snapshot: any, context: any) => {
  const data_creada = snapshot.data ();
  const batch = db.batch ();
  console.log ('data creada', data_creada);

  if (data_creada.aprobado === true) {
    const ref = db.collection ('Estadisticas_Prestadores_Provincias').doc (data_creada.provincia.id);
    return db.runTransaction((t: any) => {
      return t.get (ref).then ((doc: any) => {
        const data = doc.data ();        

        const update: any = {};

        if (doc.exists === false) {
          update ['id'] = data_creada.provincia.id;
          update ['nombre'] = data_creada.provincia.nombre;
          
          update ['total_agencias'] = 1;
          update [moment ().format ('[total_agencias_]YYYY')] = 1;
          update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 1;

          update ['total_alojamientos'] = 0;
          update [moment ().format ('[total_alojamientos_]YYYY')] = 0;
          update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 0;

          update ['total_restaurantes'] = 0;
          update [moment ().format ('[total_restaurantes_]YYYY')] = 0;
          update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 0;

          update ['total_guias'] = 0;
          update [moment ().format ('[total_guias_]YYYY')] = 0;
          update [moment ().format ('[total_guias_]YYYY[_]MM')] = 0;

          t.set(ref, update);
        } else {
          update ['total_agencias'] = data ['total_agencias'] + 1;

          if (data [moment ().format ('[total_agencias_]YYYY')] === undefined) {
            update [moment ().format ('[total_agencias_]YYYY')] = 1;
          } else {
            update [moment ().format ('[total_agencias_]YYYY')] = data [moment ().format ('[total_agencias_]YYYY')] + 1;
          }

          if (data [moment ().format ('[total_agencias_]YYYY[_]MM')] === undefined) {
            update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 1;
          } else {
            update [moment ().format ('[total_agencias_]YYYY[_]MM')] = data [moment ().format ('[total_agencias_]YYYY[_]MM')] + 1;
          }

          t.update (ref, update);
        }
      });
    })
    .then (() => {
      const ref_02 = db.collection ('Estadisticas_Prestadores_Distritos').doc (data_creada.distrito.id);

      return db.runTransaction((t: any) => {
        return t.get (ref_02).then ((doc: any) => {
          const data = doc.data ();        

          const update: any = {};

          if (doc.exists === false) {
            update ['id'] = data_creada.distrito.id;
            update ['nombre'] = data_creada.distrito.nombre;
            update ['provincia_id'] = data_creada.provincia.id;

            update ['total_agencias'] = 1;
            update [moment ().format ('[total_agencias_]YYYY')] = 1;
            update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 1;

            update ['total_alojamientos'] = 0;
            update [moment ().format ('[total_alojamientos_]YYYY')] = 0;
            update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 0;

            update ['total_restaurantes'] = 0;
            update [moment ().format ('[total_restaurantes_]YYYY')] = 0;
            update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 0;

            update ['total_guias'] = 0;
            update [moment ().format ('[total_guias_]YYYY')] = 0;
            update [moment ().format ('[total_guias_]YYYY[_]MM')] = 0;

            t.set(ref_02, update);
          } else {
            update ['total_agencias'] = data ['total_agencias'] + 1;

            if (data [moment ().format ('[total_agencias_]YYYY')] === undefined) {
              update [moment ().format ('[total_agencias_]YYYY')] = 1;
            } else {
              update [moment ().format ('[total_agencias_]YYYY')] = data [moment ().format ('[total_agencias_]YYYY')] + 1;
            }
    
            if (data [moment ().format ('[total_agencias_]YYYY[_]MM')] === undefined) {
              update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 1;
            } else {
              update [moment ().format ('[total_agencias_]YYYY[_]MM')] = data [moment ().format ('[total_agencias_]YYYY[_]MM')] + 1;
            }

            t.update (ref_02, update);
          }
        });
      })
      .then (() => {
        const step_1 = db.collection ('Users').doc (data_creada.id);
        batch.set (step_1, { 
            'id': data_creada.id,
            'correo': data_creada.correo, 
            'password': data_creada.password,
            'producto_tipo': 'agencia',
            'tipo_usuario': 'proveedor'
        });

        const step_2 = db.collection ('Correos_Usados').doc (data_creada.correo);
        batch.set (step_2, { 
            'id': data_creada.correo
        });

        return batch.commit ();
      });
    });
  } else {
    const filePath = path.join(__dirname, '/templates/correo-recepcion.html');
    fs.readFile (filePath, 'utf-8', (err: any, data: any) => {
      const mailOptions: any = {
        from: 'Dircetur CUSCO <dirceturapp@gmail.com>',
        to: data_creada.correo,
        subject: 'Tu registro ha sido enviado',
        html: data.toString (),
      };

      mailOptions.attachments = [
        {
          filename: "Formato ESNNA-MINCETUR.pdf",
          path: "https://firebasestorage.googleapis.com/v0/b/dirceturcuscoapp.appspot.com/o/extras%2FRM_430_2018_MINCETUR_ANEXO-II_ESNNA.pdf?alt=media&token=29a9e4ad-0cb2-49b1-b715-3f00db98c1f3"
        },
        {
          filename: "SOLICITUD DE TRAMITE DE PRESTADORES DE SERVICIOS TURISTICOS.pdf",
          path: "https://firebasestorage.googleapis.com/v0/b/dirceturcuscoapp.appspot.com/o/extras%2FSOLICITUD%20DE%20TRAMITE%20DE%20PRESTADORES%20DE%20SERVICIOS%20TURISTICOS%20(1).pdf?alt=media&token=2f6c1338-908f-481e-89e5-e1e79a5bc4d1"
        }
      ];

      return transporter.sendMail (mailOptions, (error: any, info: any) => {
          if (error) {
              console.log ('sendMail error', error);
              
          } else {
              console.log ('Sended', info);
          }
      }); 
    });
  }

  return 0;
});

exports.addAgenciaAprobado = functions.firestore.document ('Agencias/{id}').onUpdate ((snapshot: any, context: any) => {
  const data_before: any = snapshot.before.data ();  
  const data_creada = snapshot.after.data ();
  const batch = db.batch ();

  if (data_before.aprobado !== data_creada.aprobado && data_creada.aprobado === true) {
    const ref = db.collection ('Estadisticas_Prestadores_Provincias').doc (data_creada.provincia.id);
    return db.runTransaction((t: any) => {
      return t.get (ref).then ((doc: any) => {
        const data = doc.data ();        

        const update: any = {};

        if (doc.exists === false) {
          update ['id'] = data_creada.provincia.id;
          update ['nombre'] = data_creada.provincia.nombre;
          
          update ['total_agencias'] = 1;
          update [moment ().format ('[total_agencias_]YYYY')] = 1;
          update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 1;

          update ['total_alojamientos'] = 0;
          update [moment ().format ('[total_alojamientos_]YYYY')] = 0;
          update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 0;

          update ['total_restaurantes'] = 0;
          update [moment ().format ('[total_restaurantes_]YYYY')] = 0;
          update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 0;

          update ['total_guias'] = 0;
          update [moment ().format ('[total_guias_]YYYY')] = 0;
          update [moment ().format ('[total_guias_]YYYY[_]MM')] = 0;

          t.set(ref, update);
        } else {
          update ['total_agencias'] = data ['total_agencias'] + 1;

          if (data [moment ().format ('[total_agencias_]YYYY')] === undefined) {
            update [moment ().format ('[total_agencias_]YYYY')] = 1;
          } else {
            update [moment ().format ('[total_agencias_]YYYY')] = data [moment ().format ('[total_agencias_]YYYY')] + 1;
          }

          if (data [moment ().format ('[total_agencias_]YYYY[_]MM')] === undefined) {
            update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 1;
          } else {
            update [moment ().format ('[total_agencias_]YYYY[_]MM')] = data [moment ().format ('[total_agencias_]YYYY[_]MM')] + 1;
          }

          t.update (ref, update);
        }
      });
    })
    .then (() => {
      const ref_02 = db.collection ('Estadisticas_Prestadores_Distritos').doc (data_creada.distrito.id);

      return db.runTransaction((t: any) => {
        return t.get (ref_02).then ((doc: any) => {
          const data = doc.data ();        

          const update: any = {};

          if (doc.exists === false) {
            update ['id'] = data_creada.distrito.id;
            update ['nombre'] = data_creada.distrito.nombre;
            update ['provincia_id'] = data_creada.provincia.id;

            update ['total_agencias'] = 1;
            update [moment ().format ('[total_agencias_]YYYY')] = 1;
            update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 1;

            update ['total_alojamientos'] = 0;
            update [moment ().format ('[total_alojamientos_]YYYY')] = 0;
            update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 0;

            update ['total_restaurantes'] = 0;
            update [moment ().format ('[total_restaurantes_]YYYY')] = 0;
            update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 0;

            update ['total_guias'] = 0;
            update [moment ().format ('[total_guias_]YYYY')] = 0;
            update [moment ().format ('[total_guias_]YYYY[_]MM')] = 0;

            t.set(ref_02, update);
          } else {
            update ['total_agencias'] = data ['total_agencias'] + 1;

            if (update [moment ().format ('[total_agencias_]YYYY')] === undefined) {
              data [moment ().format ('[total_agencias_]YYYY')] = 1;
            } else {
              update [moment ().format ('[total_agencias_]YYYY')] = data [moment ().format ('[total_agencias_]YYYY')] + 1;
            }
    
            if (data [moment ().format ('[total_agencias_]YYYY[_]MM')] === undefined) {
              update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 1;
            } else {
              update [moment ().format ('[total_agencias_]YYYY[_]MM')] = data [moment ().format ('[total_agencias_]YYYY[_]MM')] + 1;
            }

            t.update (ref_02, update);
          }
        });
      })
      .then (async () => {
        const step_1 = db.collection ('Users').doc (data_creada.id);
        batch.set (step_1, { 
            'id': data_creada.id,
            'correo': data_creada.correo, 
            'password': data_creada.password,
            'producto_tipo': 'agencia',
            'tipo_usuario': 'proveedor'
        });

        // Generando certificado
        const prestadores_preferencias: any = await db.collection ('PrestadoresPreferencias').doc ('preferencias').get ();
        let nro_certificado = prestadores_preferencias.data ().agencia_cantidad;
        if (prestadores_preferencias.data ().contador_habilitado) {
          nro_certificado = nro_certificado + 1;
        }

        const step_3 = db.collection ('Agencias').doc (data_creada.id);
        batch.update (step_3, {nro_certificado: nro_certificado});

        return batch.commit ().then (() => {
          return db.runTransaction ((t: any) => {
            return t.get (db.collection ('PrestadoresPreferencias').doc ('preferencias')).then ((doc: any) => {
              const update = doc.data ();

              update.agencia_cantidad = update.agencia_cantidad + 1;

              t.update (db.collection ('PrestadoresPreferencias').doc ('preferencias'), update);
            });3
          }).then (() => {
            return sendEmail ('agencia', 'agencia-cartilla', 'agencia', data_creada, nro_certificado);
          });
        });
      });
    });
  }

  if (data_before.rechazado !== data_creada.rechazado && data_creada.rechazado === true) {
    const step_01 = db.collection ('Agencias').doc (data_creada.id);
    batch.delete (step_01);
    
    const step_02 = db.collection ('Correos_Usados').doc (data_creada.correo);
    batch.delete (step_02);

    const step_03 = db.collection ('RUC_Usados').doc (data_creada.representante_ruc.toString ());
    batch.delete (step_03);

    return batch.commit ().then (() => {
      const filePath = path.join(__dirname, '/templates/correo-rechazado.html');
      fs.readFile (filePath, 'utf-8', (err: any, _data: any) => {
        let dataString = _data.toString ();
        dataString = dataString.replace ('__rechazo_motivo__', data_creada.rechazo_motivo);

        const mailOptions: any = {
          from: 'Dircetur CUSCO <dirceturapp@gmail.com>',
          to: data_creada.correo,
          bcc: 'serviciosturisticos@dirceturcusco.gob.pe',
          subject: 'Su registro ha sido rechazado',
          html: dataString,
        };

        return transporter.sendMail (mailOptions, (error: any, info: any) => {
            if (error) {
                console.log ('sendMail error', error);
            } else {
                console.log ('Sended', info);
            }
        });
      });
    });
  }

  return 0;
});

// Alojamientos
exports.addAlojamientoAlgolia = functions.firestore.document ('Alojamientos/{id}').onCreate ((snapshot: any, context: any) => {
  if (snapshot.data ().aprobado === true) {
    const data: any = {
      'nombre': snapshot.data ().nombre_comercial,
      'ruc': snapshot.data ().ruc,
      'razon_social': snapshot.data ().razon_social,
      'tipo': 'alojamiento'
    };
    const objectID = snapshot.id;
  
    return index.addObject ({
      objectID,
      ...data
    });
  }

  return 0;
});

// EVENTO: Eliminar objeto de algolia al eliminar el objeto del nodo
exports.deleteAlojamientoAlgolia = functions.firestore.document ('Alojamientos/{id}').onDelete ((snapshot: any, context: any) => {
  const data = snapshot.data ();
  return index.deleteObject (data.id);
});

exports.addAlojamientoAlgoliaAprobado = functions.firestore.document ('Alojamientos/{id}').onUpdate ((snapshot: any, context: any) => {
  const data_before: any = snapshot.before.data ();  
  const data: any = snapshot.after.data ();

  if (data_before.aprobado !== data.aprobado && data.aprobado === true) {
    const request: any = {
      'nombre': data.nombre_comercial,
      'tipo': 'alojamiento'
    };
    const objectID = data.id;
  
    return index.addObject ({
      objectID,
      ...request
    });
  }

  return 0;
});

exports.addAlojamientoAprobado = functions.firestore.document ('Alojamientos/{id}').onUpdate ((snapshot: any, context: any) => {
  const data_before: any = snapshot.before.data ();  
  const data_creada = snapshot.after.data ();
  const batch = db.batch ();

  if (data_before.aprobado !== data_creada.aprobado && data_creada.aprobado === true) {
    const ref = db.collection ('Estadisticas_Prestadores_Provincias').doc (data_creada.provincia.id);
    return db.runTransaction((t: any) => {
      return t.get (ref).then ((doc: any) => {
        const data = doc.data ();        
  
        const update: any = {};
  
        if (doc.exists === false) {
          update ['id'] = data_creada.provincia.id;
          update ['nombre'] = data_creada.provincia.nombre;
          
          update ['total_agencias'] = 0;
          update [moment ().format ('[total_agencias_]YYYY')] = 0;
          update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 0;
  
          update ['total_alojamientos'] = 1;
          update [moment ().format ('[total_alojamientos_]YYYY')] = 1;
          update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 1;
  
          update ['total_restaurantes'] = 0;
          update [moment ().format ('[total_restaurantes_]YYYY')] = 0;
          update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 0;
  
          update ['total_guias'] = 0;
          update [moment ().format ('[total_guias_]YYYY')] = 0;
          update [moment ().format ('[total_guias_]YYYY[_]MM')] = 0;
  
          t.set(ref, update);
        } else {
          update ['total_alojamientos'] = data ['total_alojamientos'] + 1;
  
          if (data [moment ().format ('[total_alojamientos_]YYYY')] === undefined) {
            update [moment ().format ('[total_alojamientos_]YYYY')] = 1;
          } else {
            update [moment ().format ('[total_alojamientos_]YYYY')] = data [moment ().format ('[total_alojamientos_]YYYY')] + 1;
          }
  
          if (data [moment ().format ('[total_alojamientos_]YYYY[_]MM')] === undefined) {
            update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 1;
          } else {
            update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = data [moment ().format ('[total_alojamientos_]YYYY[_]MM')] + 1;
          }
  
          t.update (ref, update);
        }
      });
    })
    .then (() => {
      const ref_02 = db.collection ('Estadisticas_Prestadores_Distritos').doc (data_creada.distrito.id);
  
      return db.runTransaction((t: any) => {
        return t.get (ref_02).then ((doc: any) => {
          const data = doc.data ();        
  
          const update: any = {};
  
          if (doc.exists === false) {
            update ['id'] = data_creada.distrito.id;
            update ['nombre'] = data_creada.distrito.nombre;
            update ['provincia_id'] = data_creada.provincia.id;
  
            update ['total_agencias'] = 0;
            update [moment ().format ('[total_agencias_]YYYY')] = 0;
            update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 0;
  
            update ['total_alojamientos'] = 1;
            update [moment ().format ('[total_alojamientos_]YYYY')] = 1;
            update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 1;
  
            update ['total_restaurantes'] = 0;
            update [moment ().format ('[total_restaurantes_]YYYY')] = 0;
            update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 0;
  
            update ['total_guias'] = 0;
            update [moment ().format ('[total_guias_]YYYY')] = 0;
            update [moment ().format ('[total_guias_]YYYY[_]MM')] = 0;
  
            t.set(ref_02, update);
          } else {
            update ['total_alojamientos'] = data ['total_alojamientos'] + 1;
            
            if (data [moment ().format ('[total_alojamientos_]YYYY')] === undefined) {
              update [moment ().format ('[total_alojamientos_]YYYY')] = 1;
            } else {
              update [moment ().format ('[total_alojamientos_]YYYY')] = data [moment ().format ('[total_alojamientos_]YYYY')] + 1;
            }
    
            if (data [moment ().format ('[total_alojamientos_]YYYY[_]MM')] === undefined) {
              update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 1;
            } else {
              update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = data [moment ().format ('[total_alojamientos_]YYYY[_]MM')] + 1;
            }
            
            t.update (ref_02, update);
          }
        });
      })
      .then (async () => {
        const step_1 = db.collection ('Users').doc (data_creada.id);
        batch.set (step_1, { 
            'id': data_creada.id,
            'correo': data_creada.correo, 
            'password': data_creada.password,
            'producto_tipo': 'alojamiento',
            'tipo_usuario': 'proveedor'
        });

        // Generando certificado
        const prestadores_preferencias: any = await db.collection ('PrestadoresPreferencias').doc ('preferencias').get ();

        let nro_certificado = prestadores_preferencias.data ().alojamiento_cantidad;
        if (prestadores_preferencias.data ().contador_habilitado) {
          nro_certificado = nro_certificado + 1;
        }

        const step_3 = db.collection ('Alojamientos').doc (data_creada.id);
        batch.update (step_3, {nro_certificado: nro_certificado});

        return batch.commit ().then (() => {
          return db.runTransaction((t: any) => {
            return t.get (db.collection ('PrestadoresPreferencias').doc ('preferencias')).then ((doc: any) => {
              const update = doc.data ();

              update.alojamiento_cantidad = update.alojamiento_cantidad + 1;

              t.update (db.collection ('PrestadoresPreferencias').doc ('preferencias'), update);
            });
          }).then (() => {
            return sendEmail ('alojamiento', 'alojamiento-cartilla', 'alojamiento', data_creada, nro_certificado);
          })
        });
      });
    });
  }

  if (data_before.rechazado !== data_creada.rechazado && data_creada.rechazado === true) {
    const step_01 = db.collection ('Alojamientos').doc (data_creada.id);
    batch.delete (step_01);

    const step_02 = db.collection ('Correos_Usados').doc (data_creada.correo);
    batch.delete (step_02);

    const step_03 = db.collection ('RUC_Usados').doc (data_creada.ruc.toString ());
    batch.delete (step_03);

    return batch.commit ().then (() => {
      const filePath = path.join(__dirname, '/templates/correo-rechazado.html');
      fs.readFile (filePath, 'utf-8', (err: any, _data: any) => {
        let dataString = _data.toString ();
        dataString = dataString.replace ('__rechazo_motivo__', data_creada.rechazo_motivo);

        const mailOptions: any = {
          from: 'Dircetur CUSCO <dirceturapp@gmail.com>',
          to: data_creada.correo,
          bcc: 'serviciosturisticos@dirceturcusco.gob.pe',
          subject: 'Su registro a sido rechazado',
          html: dataString,
        };

        return transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                console.log ('sendMail error', error);
            } else {
                console.log ('Sended', info);
            }
        });
      });
    });
  }

  return 0;
});

exports.addAlojamiento = functions.firestore.document ('Alojamientos/{id}').onCreate ((snapshot: any, context: any) => {
  const data_creada = snapshot.data ();
  const batch = db.batch ();

  if (snapshot.data ().aprobado === true) {
    const ref = db.collection ('Estadisticas_Prestadores_Provincias').doc (data_creada.provincia.id);
    return db.runTransaction((t: any) => {
      return t.get (ref).then ((doc: any) => {
        const data = doc.data ();        
  
        const update: any = {};
  
        if (doc.exists === false) {
          update ['id'] = data_creada.provincia.id;
          update ['nombre'] = data_creada.provincia.nombre;
          
          update ['total_agencias'] = 0;
          update [moment ().format ('[total_agencias_]YYYY')] = 0;
          update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 0;
  
          update ['total_alojamientos'] = 1;
          update [moment ().format ('[total_alojamientos_]YYYY')] = 1;
          update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 1;
  
          update ['total_restaurantes'] = 0;
          update [moment ().format ('[total_restaurantes_]YYYY')] = 0;
          update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 0;
  
          update ['total_guias'] = 0;
          update [moment ().format ('[total_guias_]YYYY')] = 0;
          update [moment ().format ('[total_guias_]YYYY[_]MM')] = 0;
  
          t.set(ref, update);
        } else {
          update ['total_alojamientos'] = data ['total_alojamientos'] + 1;
  
          if (data [moment ().format ('[total_alojamientos_]YYYY')] === undefined) {
            update [moment ().format ('[total_alojamientos_]YYYY')] = 1;
          } else {
            update [moment ().format ('[total_alojamientos_]YYYY')] = data [moment ().format ('[total_alojamientos_]YYYY')] + 1;
          }
  
          if (data [moment ().format ('[total_alojamientos_]YYYY[_]MM')] === undefined) {
            update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 1;
          } else {
            update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = data [moment ().format ('[total_alojamientos_]YYYY[_]MM')] + 1;
          }
  
          t.update (ref, update);
        }
      });
    })
    .then (() => {
      const ref_02 = db.collection ('Estadisticas_Prestadores_Distritos').doc (data_creada.distrito.id);
  
      return db.runTransaction((t: any) => {
        return t.get (ref_02).then ((doc: any) => {
          const data = doc.data ();        
  
          const update: any = {};
  
          if (doc.exists === false) {
            update ['id'] = data_creada.distrito.id;
            update ['nombre'] = data_creada.distrito.nombre;
            update ['provincia_id'] = data_creada.provincia.id;
  
            update ['total_agencias'] = 0;
            update [moment ().format ('[total_agencias_]YYYY')] = 0;
            update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 0;
  
            update ['total_alojamientos'] = 1;
            update [moment ().format ('[total_alojamientos_]YYYY')] = 1;
            update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 1;
  
            update ['total_restaurantes'] = 0;
            update [moment ().format ('[total_restaurantes_]YYYY')] = 0;
            update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 0;
  
            update ['total_guias'] = 0;
            update [moment ().format ('[total_guias_]YYYY')] = 0;
            update [moment ().format ('[total_guias_]YYYY[_]MM')] = 0;
  
            t.set(ref_02, update);
          } else {
            update ['total_alojamientos'] = data ['total_alojamientos'] + 1;
            
            if (data [moment ().format ('[total_alojamientos_]YYYY')] === undefined) {
              update [moment ().format ('[total_alojamientos_]YYYY')] = 1;
            } else {
              update [moment ().format ('[total_alojamientos_]YYYY')] = data [moment ().format ('[total_alojamientos_]YYYY')] + 1;
            }
    
            if (data [moment ().format ('[total_alojamientos_]YYYY[_]MM')] === undefined) {
              update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 1;
            } else {
              update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = data [moment ().format ('[total_alojamientos_]YYYY[_]MM')] + 1;
            }
            
            t.update (ref_02, update);
          }
        });
      })
      .then (() => {
        const step_1 = db.collection ('Users').doc (data_creada.id);
        batch.set (step_1, { 
            'id': data_creada.id,
            'correo': data_creada.correo, 
            'password': data_creada.password,
            'producto_tipo': 'alojamiento',
            'tipo_usuario': 'proveedor'
        });
  
        const step_2 = db.collection ('Correos_Usados').doc (data_creada.correo);
        batch.set (step_2, { 
            'id': data_creada.correo
        });
  
        return batch.commit ();
      });
    });
  } else {
    const filePath = path.join(__dirname, '/templates/correo-recepcion.html');
    fs.readFile (filePath, 'utf-8', (err: any, data: any) => {
      const mailOptions: any = {
        from: 'Dircetur CUSCO <dirceturapp@gmail.com>',
        to: data_creada.correo,
        subject: 'Tu registro a sido enviado',
        html: data.toString (),
      };

      mailOptions.attachments = [
        {
          filename: "Formato ESNNA-MINCETUR.pdf",
          path: "https://firebasestorage.googleapis.com/v0/b/dirceturcuscoapp.appspot.com/o/extras%2FRM_430_2018_MINCETUR_ANEXO-II_ESNNA.pdf?alt=media&token=29a9e4ad-0cb2-49b1-b715-3f00db98c1f3"
        },
        {
          filename: "SOLICITUD DE TRAMITE DE PRESTADORES DE SERVICIOS TURISTICOS.pdf",
          path: "https://firebasestorage.googleapis.com/v0/b/dirceturcuscoapp.appspot.com/o/extras%2FSOLICITUD%20DE%20TRAMITE%20DE%20PRESTADORES%20DE%20SERVICIOS%20TURISTICOS%20(1).pdf?alt=media&token=2f6c1338-908f-481e-89e5-e1e79a5bc4d1"
        }
      ];

      console.log ('mailOptions', mailOptions);
      return transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
              console.log ('sendMail error', error);
          } else {
              console.log ('Sended', info);
          }
      }); 
    });
  }

  return 0;
});

// Restaurantes
exports.addRestauranteAlgolia = functions.firestore.document ('Restaurantes/{id}').onCreate ((snapshot: any, context: any) => {
  if (snapshot.data ().aprobado === true) {
    const data: any = {
      'nombre': snapshot.data ().nombre_comercial,
      'ruc': snapshot.data ().ruc,
      'razon_social': snapshot.data ().razon_social,
      'tipo': 'restaurante'
    };
    const objectID = snapshot.id;
  
    return index.addObject({
      objectID,
      ...data
    });
  }

  return 0;
});

exports.addRestaurante = functions.firestore.document ('Restaurantes/{id}').onCreate (async (snapshot: any, context: any) => {
  const data_creada = snapshot.data ();
  const batch = db.batch ();

  if (data_creada.correo !== '' && data_creada.correo !== undefined) {
    let password: string = data_creada.password;
    if (password === '') {
      password = Math.random ().toString (36).slice (-8);
    }

    const step_1 = db.collection ('Users').doc (data_creada.id);
    batch.set (step_1, { 
      'id': data_creada.id,
      'correo': data_creada.correo, 
      'password': password,
      'producto_tipo': 'restaurante',
      'tipo_usuario': 'proveedor'
    });

    const step_2 = db.collection ('Correos_Usados').doc (data_creada.correo);
    batch.set (step_2, { 
        'id': data_creada.correo
    });

    await batch.commit ()
      .then (() => {
        const dest = data_creada.correo;
        const mailOptions = {
            from: 'Dircetu CUSCO <dirceturapp@gmail.com>',
            to: dest,
            subject: 'Registro de usuario',
            html: `
                <h3>Hola ${data_creada.nombre_completo}, tus datos de acceso son los siguientes:<h3>
                <p>Correo: <b>${data_creada.correo}<b></p>
                <p>Contraseña: <b>${password}<b></p>
            `
        };

        transporter.sendMail (mailOptions, (error: any, info: any) => {
            if (error) {
                console.log ('sendMail error', error);
            } else {
                console.log ('Sended', info);
            }
        });
      });
  }
  
  const ref = db.collection ('Estadisticas_Prestadores_Provincias').doc (data_creada.provincia.id);

  return db.runTransaction((t: any) => {
    return t.get (ref).then ((doc: any) => {
      const data = doc.data ();        

      const update: any = {};

      if (doc.exists === false) {
        update ['id'] = data_creada.provincia.id;
        update ['nombre'] = data_creada.provincia.nombre;
        
        update ['total_agencias'] = 0;
        update [moment ().format ('[total_agencias_]YYYY')] = 0;
        update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 0;

        update ['total_alojamientos'] = 0;
        update [moment ().format ('[total_alojamientos_]YYYY')] = 0;
        update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 0;

        update ['total_restaurantes'] = 1;
        update [moment ().format ('[total_restaurantes_]YYYY')] = 1;
        update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 1;

        update ['total_guias'] = 0;
        update [moment ().format ('[total_guias_]YYYY')] = 0;
        update [moment ().format ('[total_guias_]YYYY[_]MM')] = 0;

        t.set(ref, update);
      } else {
        update ['total_restaurantes'] = data ['total_restaurantes'] + 1;

        if (data [moment ().format ('[total_restaurantes_]YYYY')] === undefined) {
          update [moment ().format ('[total_restaurantes_]YYYY')] = 1;
        } else {
          update [moment ().format ('[total_restaurantes_]YYYY')] = data [moment ().format ('[total_restaurantes_]YYYY')] + 1;
        }

        if (data [moment ().format ('[total_restaurantes_]YYYY[_]MM')] === undefined) {
          update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 1;
        } else {
          update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = data [moment ().format ('[total_restaurantes_]YYYY[_]MM')] + 1;
        }

        t.update (ref, update);
      }
    });
  })
  .then (() => {
    const ref_02 = db.collection ('Estadisticas_Prestadores_Distritos').doc (data_creada.distrito.id);

    return db.runTransaction((t: any) => {
      return t.get (ref_02).then ((doc: any) => {
        const data = doc.data ();        

        const update: any = {};

        if (doc.exists === false) {
          update ['id'] = data_creada.distrito.id;
          update ['nombre'] = data_creada.distrito.nombre;
          update ['provincia_id'] = data_creada.provincia.id;

          update ['total_agencias'] = 0;
          update [moment ().format ('[total_agencias_]YYYY')] = 0;
          update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 0;

          update ['total_alojamientos'] = 0;
          update [moment ().format ('[total_alojamientos_]YYYY')] = 0;
          update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 0;

          update ['total_restaurantes'] = 1;
          update [moment ().format ('[total_restaurantes_]YYYY')] = 1;
          update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 1;

          update ['total_guias'] = 0;
          update [moment ().format ('[total_guias_]YYYY')] = 0;
          update [moment ().format ('[total_guias_]YYYY[_]MM')] = 0;

          t.set(ref_02, update);
        } else {
          update ['total_restaurantes'] = data ['total_restaurantes'] + 1;

          if (data [moment ().format ('[total_restaurantes_]YYYY')] === undefined) {
            update [moment ().format ('[total_restaurantes_]YYYY')] = 1;
          } else {
            update [moment ().format ('[total_restaurantes_]YYYY')] = data [moment ().format ('[total_restaurantes_]YYYY')] + 1;
          }
  
          if (data [moment ().format ('[total_restaurantes_]YYYY[_]MM')] === undefined) {
            update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 1;
          } else {
            update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = data [moment ().format ('[total_restaurantes_]YYYY[_]MM')] + 1;
          }
          
          t.update (ref_02, update);
        }
      });
    });
  });
});

// Guias
exports.addGuiaAlgolia = functions.firestore.document ('Guias/{id}').onCreate ((snapshot: any, context: any) => {
  const data: any = {
    'nombre': snapshot.data ().nombres + snapshot.data ().apellidos,
    'ruc': snapshot.data ().ruc,
    'razon_social': snapshot.data ().nombres + snapshot.data ().apellidos,
    'tipo': 'guia'
  };

  const objectID = snapshot.id;

  return index.addObject({
    objectID,
    ...data
  });
});

exports.addGuia = functions.firestore.document ('Guias/{id}').onCreate (async (snapshot: any, context: any) => {
  const data_creada = snapshot.data ();
  // const batch = db.batch ();

  // if (data_creada.correo !== '' && data_creada.correo !== undefined) {
  //   let password: string = data_creada.password;
  //   if (password === '') {
  //     password = Math.random ().toString (36).slice (-8);
  //   }

  //   const step_1 = db.collection ('Users').doc (data_creada.id);
  //   batch.set (step_1, { 
  //       'id': data_creada.id,
  //       'correo': data_creada.correo, 
  //       'password': password,
  //       'producto_tipo': 'guia',
  //       'tipo_usuario': 'proveedor'
  //   });

  //   const step_2 = db.collection ('Correos_Usados').doc (data_creada.correo);
  //   batch.set (step_2, { 
  //       'id': data_creada.correo
  //   });

  //   await batch.commit ()
  //     .then (() => {
  //       const dest = data_creada.correo;
  //       const mailOptions = {
  //           from: 'Dircetu CUSCO <dirceturapp@gmail.com>',
  //           to: dest,
  //           subject: 'Registro de usuario',
  //           html: `
  //               <h3>Hola ${data_creada.nombre_completo}, tus datos de acceso son los siguientes:<h3>
  //               <p>Correo: <b>${data_creada.correo}<b></p>
  //               <p>Contraseña: <b>${password}<b></p>
  //           `
  //       };

  //       transporter.sendMail (mailOptions, (error: any, info: any) => {
  //           if (error) {
  //               console.log ('sendMail error', error);
  //           } else {
  //               console.log ('Sended', info);
  //           }
  //       });
  //     });
  // }

  if (data_creada.provincia !== '') {
    const ref = db.collection ('Estadisticas_Prestadores_Provincias').doc (data_creada.provincia.id);
    return db.runTransaction((t: any) => {
      return t.get (ref).then ((doc: any) => {
        const data = doc.data ();        

        const update: any = {};

        if (doc.exists === false) {
          update ['id'] = data_creada.provincia.id;
          update ['nombre'] = data_creada.provincia.nombre;
          
          update ['total_agencias'] = 0;
          update [moment ().format ('[total_agencias_]YYYY')] = 0;
          update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 0;

          update ['total_alojamientos'] = 0;
          update [moment ().format ('[total_alojamientos_]YYYY')] = 0;
          update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 0;

          update ['total_restaurantes'] = 0;
          update [moment ().format ('[total_restaurantes_]YYYY')] = 0;
          update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 0;

          update ['total_guias'] = 1;
          update [moment ().format ('[total_guias_]YYYY')] = 1;
          update [moment ().format ('[total_guias_]YYYY[_]MM')] = 1;

          t.set (ref, update);
        } else {
          update ['total_guias'] = data ['total_guias'] + 1;

          if (data [moment ().format ('[total_guias_]YYYY')] === undefined) {
            update [moment ().format ('[total_guias_]YYYY')] = 1;
          } else {
            update [moment ().format ('[total_guias_]YYYY')] = data [moment ().format ('[total_guias_]YYYY')] + 1;
          }

          if (data [moment ().format ('[total_guias_]YYYY[_]MM')] === undefined) {
            update [moment ().format ('[total_guias_]YYYY[_]MM')] = 1;
          } else {
            update [moment ().format ('[total_guias_]YYYY[_]MM')] = data [moment ().format ('[total_guias_]YYYY[_]MM')] + 1;
          }

          t.update (ref, update);
        }
      });
    })
    .then (() => {
      if (data_creada.distrito !== '') {
        const ref_02 = db.collection ('Estadisticas_Prestadores_Distritos').doc (data_creada.distrito.id);
        return db.runTransaction((t: any) => {
          return t.get (ref_02).then ((doc: any) => {
            const data = doc.data ();        

            const update: any = {};

            if (doc.exists === false) {
              update ['id'] = data_creada.distrito.id;
              update ['nombre'] = data_creada.distrito.nombre;
              update ['provincia_id'] = data_creada.provincia.id;

              update ['total_agencias'] = 0;
              update [moment ().format ('[total_agencias_]YYYY')] = 0;
              update [moment ().format ('[total_agencias_]YYYY[_]MM')] = 0;

              update ['total_alojamientos'] = 0;
              update [moment ().format ('[total_alojamientos_]YYYY')] = 0;
              update [moment ().format ('[total_alojamientos_]YYYY[_]MM')] = 0;

              update ['total_restaurantes'] = 0;
              update [moment ().format ('[total_restaurantes_]YYYY')] = 0;
              update [moment ().format ('[total_restaurantes_]YYYY[_]MM')] = 0;

              update ['total_guias'] = 1;
              update [moment ().format ('[total_guias_]YYYY')] = 1;
              update [moment ().format ('[total_guias_]YYYY[_]MM')] = 1;

              t.set(ref_02, update);
            } else {
              update ['total_guias'] = data ['total_guias'] + 1;
              
              if (data [moment ().format ('[total_guias_]YYYY')] === undefined) {
                update [moment ().format ('[total_guias_]YYYY')] = 1;
              } else {
                update [moment ().format ('[total_guias_]YYYY')] = data [moment ().format ('[total_guias_]YYYY')] + 1;
              }
      
              if (data [moment ().format ('[total_guias_]YYYY[_]MM')] === undefined) {
                update [moment ().format ('[total_guias_]YYYY[_]MM')] = 1;
              } else {
                update [moment ().format ('[total_guias_]YYYY[_]MM')] = data [moment ().format ('[total_guias_]YYYY[_]MM')] + 1;
              }
              
              t.update (ref_02, update);
            }
          });
        });
      }

      return;
    });
  }

  return;
});

// Eventos

exports.addEvento = functions.firestore.document ('Eventos/{id}').onCreate ((snapshot: any, context: any) => {
    const data = snapshot.data ();
    const batch = db.batch ();
    
    const step_03 = db.collection ('Eventos_Fechas').doc (moment(data.fecha).format('MM')).collection ("Eventos").doc (data.id);
    batch.set (step_03, {
      id: data.id
    });
    
    return batch.commit ();
});

exports.addEventoArtesania = functions.firestore.document ('Eventos_Artesania/{id}').onCreate ((snapshot: any, context: any) => {
    const data = snapshot.data ();
    const batch = db.batch ();

    const step_1 = db.collection ('Provincias').doc (data.provincia.id).collection ('Lista_Eventos_Artesania').doc (data.id);
    batch.set (step_1, { 
        'id': data.id,
        'titulo': data.titulo,
        'fecha': data.fecha,
        'organizador': data.organizador
    });

    const step_2 = db.collection ('Provincias').doc (data.provincia.id)
        .collection ('Distritos').doc (data.distrito.id).collection ('Lista_Eventos_Artesania').doc (data.id);
    batch.set (step_2, { 
        'id': data.id,
        'titulo': data.titulo,
        'fecha': data.fecha,
        'organizador': data.organizador
    });

    const step_03 = db.collection ('Eventos_Artesania_Fechas').doc (moment(data.fecha).format('MM')).collection ("Eventos").doc (data.id);
    batch.set (step_03, {
      id: data.id
    });

    return batch.commit ();
});

exports.createUser = functions.firestore.document ('Users/{user}').onCreate ((snapshot: any, context: any) => {
    const id = snapshot.data ().id;
    const email = snapshot.data ().correo;
    const password = snapshot.data ().password;
  
    return admin.auth ().createUser ({
      uid: id,
      email: email,
      password: password
    }).then (() => {
      // Enviamos correo electronico de confirmacion de password
    });
});

exports.addCountViajeProgramadoSalidas = functions.firestore.document ('Viajes_Programados/{viaje_id}/Salidas/{salida_id}').onCreate ((snapshot: any, context: any) => {
    const viaje_id = context.params.viaje_id;
  
    const ref = db.collection ('Viajes_Programados').doc (viaje_id);
  
    return db.runTransaction((t: any) => {
      return t.get (ref).then ((doc: any) => {
        const update = doc.data ();
        let new_count: number;

        if (update ['nro_salidas'] === undefined) {
          new_count = 1;
        } else {
          new_count = update ['nro_salidas'] + 1;
        }

        update ['nro_salidas'] = new_count;
        t.update (ref, update);
      });
    });            
});

exports.addCountViajeroProgramadoSalidas = functions.firestore.document ('Viajes_Programados/{viaje_id}/Salidas/{salida_id}/Viajeros/{viajero_id}').onCreate (async (snapshot: any, context: any) => {
  const viaje_id = context.params.viaje_id;
  const salida_id = context.params.salida_id;
  
  const data = snapshot.data ();
  const viaje_data: any = await db.collection ('Viajes_Programados').doc (viaje_id).get ();
  const salida: any = await db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id).get ();

  console.log ('viaje_data', viaje_data.data ());
  console.log ('salida', salida.data ());

  // Send Email
  const dest = data.correo;
  const mailOptions = {
      from: 'Dircetu CUSCO <dirceturapp@gmail.com>',
      to: dest,
      subject: 'Dircetur | Registro turismo social',
      html: `
          <h3>Hola ${data.nombre_completo}<h3>
          <p>Te haz registrado en el viaje <b>${viaje_data.data ().nombre}</b> para la salida del ${moment (salida.data ().fecha_salida).format ('LLL')}</p>
      `
  };

  transporter.sendMail (mailOptions, (error: any, info: any) => {
      if (error) {
          console.log ('sendMail error', error);
      } else {
          console.log ('Sended', info);
      }
  });

  const ref = db.collection ('Viajes_Programados').doc (viaje_id);
  let new_count: number;

  if (viaje_data.data ().ultimo_viaje_nro_incritos >= viaje_data.data ().ultimo_viaje_cupos) {
    if (viaje_data.data ().ultimo_viaje_nro_pendientes < 10 || viaje_data.data ().ultimo_viaje_nro_pendientes === undefined) {
      return db.runTransaction((t: any) => {
        return t.get (ref).then (async (doc: any) => {
          const data_viaje = doc.data ();
          const update: any = {};
    
          if (data_viaje ['ultimo_viaje_nro_pendientes'] === undefined) {
            new_count = 1;
            update ['ultimo_viaje_nro_pendientes'] = 1;
          } else {
            new_count = data_viaje ['ultimo_viaje_nro_pendientes'] + 1;
            update ['ultimo_viaje_nro_pendientes'] = new_count;
          }

          const batch = db.batch ();
  
          const step_1 = db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id);
          batch.update (step_1, { 
            'nro_pendientes': new_count
          });
  
          const step_2 = db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id).collection ('Viajeros').doc (data.dni);
            batch.update (step_2, { 
            'esta_cola': true
          });
  
          await batch.commit ();
          t.update (ref, update);
        });           
      });
    }
  } else {
    console.log ("Entro en false, inicicia trans");

    const ref_2 = db.collection ('Viajes_Programados').doc (viaje_id);

    return db.runTransaction((t: any) => {
      return t.get (ref_2).then (async (doc: any) => {
        const data_viaje = doc.data ();
        const update: any = {};

        new_count = data_viaje ['ultimo_viaje_nro_incritos'] + 1;
        update ['ultimo_viaje_nro_incritos'] = new_count;

        console.log ('Ver actualizado', update);

        const batch = db.batch ();

        const step_1 = db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id);
        batch.update (step_1, { 
          'nro_inscritos': new_count
        });

        if (new_count >= viaje_data.data ().ultimo_viaje_cupos) {
          update ['estado'] = 1;

          const step_3 = db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id);
          batch.update (step_3, { 
            'estado': 1
          });
        }

        await batch.commit ();
        t.update (ref_2, update);
      });           
    }); 
  }
});

exports.checkSalidaActualizada = functions.firestore.document ('Viajes_Programados/{viaje_id}/Salidas/{salida_id}').onUpdate (async (snapshot: any, context: any) => {
    const data_before = snapshot.before.data ();  
    const data = snapshot.after.data ();
    

    const viaje_id = context.params.viaje_id;
    const viaje_data: any = await db.collection ('Viajes_Programados').doc (viaje_id).get ();


    console.log ('data_after', data)

    if (data.eliminado === true) {
        const collection = await db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (data.id).collection ('Viajeros').get ();
        collection.forEach ((doc: any) => {
          const mailOptions = {
            from: 'Dircetu CUSCO <dirceturapp@gmail.com>',
            to: doc.data ().correo,
            subject: 'Viaje cancelado | Turismo social',
            html: `
                <p>Tu viaje a sido cancelado. lo sentimos...</p>
            `
          };

          transporter.sendMail (mailOptions, (error: any, info: any) => {
            if (error) {
                console.log ('sendMail error', error);
            } else {
                console.log ('Sended', info);
            }
          });
        });

        return 0;
    } else if (data.estado === 2) {
      console.log ("Se ejecuto aqui... cerrar viaje");

      const collection = await db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (data.id).collection ('Viajeros').get ();

      collection.forEach (async (doc: any) => {
        const usuario = doc.data ();

        console.log ('Usuario', usuario);

        if (usuario.esta_cola === false || usuario.esta_cola === undefined) {
          /* Esto es para sumar el nmero de viajes del usuario */

          const batch = db.batch ();

          const step_01 = db.collection ('Usuarios_Viajes_Programados').doc (usuario.dni).collection ('Viajes_Inscritos').doc (viaje_id);  
          batch.set (step_01, {
            id: viaje_id,
            nombre: viaje_data.data ().nombre,
            ultima_salida: data.fecha_salida
          });

          const step_02 = db.collection ('Usuarios_Viajes_Programados').doc (usuario.dni).collection ('Viajes_Inscritos').doc (viaje_id).collection ('Salidas').doc (data.id);   
          batch.set (step_02, {
            id: data.id,
            checked:  usuario.checked,
            fecha: data.fecha_salida
          });

          const _ref = db.collection ('Usuarios_Viajes_Programados').doc (usuario.dni);

          await db.runTransaction((t: any) => {
            return t.get (_ref).then (async (_doc: any) => {
              const update = _doc.data ();
              let new_count;

              if (update ['nro_viajes'] === undefined) {
                new_count = 1
              } else {
                new_count = update ['nro_viajes'] + 1;
              }

              update ['nro_viajes'] = new_count;

              if (new_count >= 2) {
                const date = moment ().add (6, 'months').format ('YYYY[-]MM[-]DD');
                const step_03 = db.collection ('Usuarios_Limite_Superado').doc (date).collection ('Usuarios').doc (usuario.dni)  
                batch.set (step_03, {
                  dni: usuario.dni,
                  fecha: moment ().format ('YYYY[-]MM[-]DD')
                });
                
                const step_04 = db.collection ('Usuarios_Limite_Superado').doc (date).collection ('Usuarios').doc (usuario.dni)  
                batch.set (step_04, {
                  dni: usuario.dni,
                  fecha: moment ().format ('YYYY[-]MM[-]DD')
                });
              }

              t.update (_ref, update);
            });
          }).then (async () => {
            return await batch.commit ();
          });
        }
      });
    } else if (data_before.fecha_salida !== data.fecha_salida) {
        console.log ("Enviar correo por cambiar la fecha");
        const collection = await db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (data.id).collection ('Viajeros').get ();

        collection.forEach((doc: any) => {
          const mailOptions = {
            from: 'Dircetu CUSCO <dirceturapp@gmail.com>',
            to: doc.data ().correo,
            subject: 'Viaje reprogramado | Turismo social',
            html: `
                <p>Tu viaje a sido reprogramado para el ${moment (data.fecha_salida).format ('LLL')}. lo sentimos...</p>
            `
          };

          transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                console.log ('sendMail error', error);
            } else {
                console.log ('Sended', info);
            }
          });
        });

        return 0;
    } else if (data_before.cupos !== data.cupos) {
      console.log ("La cantidad de cupos cambio");

      const collection = await db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (data.id).collection ('Viajeros').where ('esta_cola', '==', true).orderBy ('fecha_agregado').get ();
      const cupos: number = data.cupos - data_before.cupos;
      let diferencia: number = 0;

      /*
          Antes:             2  
          Despues:           3
          Cupos disponibles: 1
          Pendientes:        5
      */

      console.log ('cupos', cupos);


      let emails: string = "";
      const batch = db.batch ();

      if (cupos > 0) {
        collection.forEach (async (i: any) => { // 4 veces
          const viajero = i.data ();

          if (diferencia < cupos) {
            console.log ("Agregamos como viajero: ", viajero.nombre_completo);
            
            emails = emails + viajero.correo + ',';

            diferencia = diferencia + 1;
            console.log ('diferencia', diferencia);

            const step = db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (data.id).collection ('Viajeros').doc (viajero.dni);
            batch.update (step, { 
              esta_cola: false
            });
          }
        });

        /*
        if (emails.length > 0) {
          const mailOptions = {
              from: 'Dircetu <dirceturapp@gmail.com>',
              to: emails,
              subject: 'Tu viaje a sido aprovado',
              html: `
                  <p>Ya te encuentras registrado del viaje</p>
              `
          };

          await transporter.sendMail(mailOptions, (error: any, info: any) => {
              if (error) {
                  console.log ('sendMail error', error);
              } else {
                  console.log ('Sended', info);
              }
          });
        }
        */

        let nuevo_pendientes = data.nro_pendientes - diferencia;
        if (nuevo_pendientes < 0) {
          nuevo_pendientes = 0;
        }

        const step_01 = db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (data.id);
        batch.update (step_01, { 
          nro_pendientes: nuevo_pendientes,
          nro_inscritos: data.nro_inscritos + diferencia
        });

        const step_02 = db.collection ('Viajes_Programados').doc (viaje_id);
        batch.update (step_02, { 
          ultimo_viaje_nro_pendientes: nuevo_pendientes,
          ultimo_viaje_nro_incritos: data.nro_inscritos + diferencia
        });

        // Actualizar nmero de incritos
        console.log ("Actualizamos numero de pendientes a:", (nuevo_pendientes));

        return batch.commit ();
      }
    }

    return 0;
});

exports.onDeleteViajero = functions.firestore.document ('Viajes_Programados/{viaje_id}/Salidas/{salida_id}/Viajeros/{viajero_id}').onDelete (async (snapshot: any, context: any) => {
  const data = snapshot.data ();

  const salida_id = context.params.salida_id;
  const viaje_id = context.params.viaje_id;

  const salida_data: any = await db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id).get ();

  const batch = db.batch ();

  console.log ('data', data);

  if (data.esta_cola === true) {
    const ref_1 = db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id);

    return db.runTransaction((t: any) => {
      return t.get (ref_1).then (async (doc: any) => {
        const _data = doc.data ();
        const update: any = {};
        let new_count: number;

        new_count = _data ['nro_pendientes'] - 1;
        update ['nro_pendientes'] = new_count;

        console.log ('nro_pendientes', update);

        t.update (ref_1, update);
      });
    }).then (() => {
      const ref_2 = db.collection ('Viajes_Programados').doc (viaje_id);

      return db.runTransaction((t: any) => {
        return t.get (ref_2).then (async (doc: any) => {
          const _data = doc.data ();
          const update: any = {};
          let new_count: number;

          new_count = _data ['ultimo_viaje_nro_pendientes'] - 1;
          update ['ultimo_viaje_nro_pendientes'] = new_count;

          console.log ('ultimo_viaje_nro_pendientes', update);

          t.update (ref_2, update);
        });
      });
    });
  } else {
    if (salida_data.data ().nro_pendientes > 0) {
      const ultimo_viajero_cola: any = await db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id).collection ('Viajeros').where ('esta_cola', '==', true).orderBy ('fecha_agregado').limit (1).get ();

      ultimo_viajero_cola.forEach((element: any) => {
          const viajero = element.data ();

          console.log ("El usuario se elimino de la cola", viajero.nombre_completo);

          const step = db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id).collection ('Viajeros').doc (viajero.dni)
          batch.update (step, { 
            esta_cola: false
          });

          /* Enviar correo de que se registro */
      });

      await batch.commit ();

      const ref_1 = db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id);

      return db.runTransaction((t: any) => {
        return t.get (ref_1).then (async (doc: any) => {
          const _data = doc.data ();
          const update: any = {};
          let new_count: number;

          new_count = _data ['nro_pendientes'] - 1;
          update ['nro_pendientes'] = new_count;

          t.update (ref_1, update);
        });
      }).then (() => {
        const ref_2 = db.collection ('Viajes_Programados').doc (viaje_id);

        return db.runTransaction((t: any) => {
          return t.get (ref_2).then (async (doc: any) => {
            const _data = doc.data ();
            const update: any = {};
            let new_count: number;

            new_count = _data ['ultimo_viaje_nro_pendientes'] - 1;
            update ['ultimo_viaje_nro_pendientes'] = new_count;

            t.update (ref_2, update);
          });
        });
      });
    } else {
      const ref_1 = db.collection ('Viajes_Programados').doc (viaje_id).collection ('Salidas').doc (salida_id);

      return db.runTransaction((t: any) => {
        return t.get (ref_1).then (async (doc: any) => {
          const _data = doc.data ();
          const update: any = {};
          let new_count: number;

          new_count = _data ['nro_inscritos'] - 1;
          update ['nro_inscritos'] = new_count;

          t.update (ref_1, update);
        });
      }).then (() => {
        const ref_2 = db.collection ('Viajes_Programados').doc (viaje_id);

        return db.runTransaction((t: any) => {
          return t.get (ref_2).then (async (doc: any) => {
            const _data = doc.data ();
            const update: any = {};
            let new_count: number;

            new_count = _data ['ultimo_viaje_nro_incritos'] - 1;
            update ['ultimo_viaje_nro_incritos'] = new_count;

            t.update (ref_2, update);
          });
        });
      });
    }
  }
});

/*  
* Funciones para enviar correo cuando una prestador es reconocido a sancionan
*/
exports.enviarCorreoReconocimientoCreado = functions.firestore.document ('Agencias/{agencia_id}/Reconocimientos/{reconocimiento_id}').onCreate (async (snapshot: any, context: any) => {
  const data = snapshot.data ();
  const agencia_id = context.params.agencia_id;

  const agencia_data: any = await db.collection ('Agencias').doc (agencia_id).get ();

  console.log (data);

  // Send Email
  const mailOptions = {
      from: 'Dircetu CUSCO <dirceturapp@gmail.com>',
      to: agencia_data.data ().correo,
      subject: 'Haz sido reconocido',
      html: `
          Hola ${agencia_data.data ().nombre_comercial}<h3>
          <p>Haz recibido un reconocimiento:<p>
          <p${data.asunto.nombre}</p>
          <p>${data.descripcion}</p>
      `
  };

  return transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
          console.log ('sendMail error', error);
      } else {
          console.log ('Sended', info);
      }
  });
});

exports.enviarCorreoSancionCreado = functions.firestore.document ('Agencias/{agencia_id}/Sanciones/{sacion_id}').onCreate (async (snapshot: any, context: any) => {
  const data = snapshot.data ();
  const agencia_id = context.params.agencia_id;

  const agencia_data: any = await db.collection ('Agencias').doc (agencia_id).get ();

  // Send Email
  const mailOptions = {
      from: 'Dircetu CUSCO <dirceturapp@gmail.com>',
      to: agencia_data.data ().correo,
      subject: 'Haz sido sancionado',
      html: `
          <h3>Hola ${agencia_data.data ().nombre_comercial}<h3>
          <p>Haz recibido una sancion:<p>
          <p${data.asunto.nombre}</p>
          <p>${data.descripcion}</p>
      `
  };

  return transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
          console.log ('sendMail error', error);
      } else {
          console.log ('Sended', info);
      }
  });
});

// Fuciones de Jose
exports.actualizarEstadisticasSolicitudes = functions.firestore.document ('Solicitudes/{solicitud_id}').onUpdate ((snapshot: any, context: any) => {
    const data_after = snapshot.after.data ();

    console.log ('data_after', data_after);

    if (data_after.estado === 2) {
      const ref = db.collection ('Estadisticas_Solicitudes_Provincias').doc (data_after.provincia.id);

      return db.runTransaction((t: any) => {
        return t.get (ref).then ((doc: any) => {
          const data = doc.data ();        

          const update: any = {};

          console.log ("Existe", doc.exists);

          if (doc.exists === false) {
            update ['tabla_' + data_after.ano] = data_after.monto;
            update ['tabla_' + data_after.ano + '_' + data_after.mes] = data_after.monto;

            update ['cantidad_' + data_after.ano] = 1;
            update ['cantidad_' + data_after.ano + '_' + data_after.mes] = 1;

            console.log ('update', update);

            t.set(ref, update);
          } else {
            const new_count = data ['tabla_' + data_after.ano] + data_after.monto;
            update ['tabla_' + data_after.ano] = new_count;

            const new_count_2 = data ['tabla_' + data_after.ano + '_' + data_after.mes] + data_after.monto;
            update ['tabla_' + data_after.ano + '_' + data_after.mes] = new_count_2;

            const new_count_3 = data ['cantidad_' + data_after.ano] + 1;
            update ['cantidad_' + data_after.ano] = new_count_3;

            const new_count_4 = data ['cantidad_' + data_after.ano + '_' + data_after.mes] + 1;
            update ['cantidad_' + data_after.ano + '_' + data_after.mes] = new_count_4;

            console.log ('update', update);

            t.update (ref, update);
          }
        });
      }).then (() => {
        const ref_02 = db.collection ('Estadisticas_Solicitudes_Distritos').doc (data_after.distrito.id);

        return db.runTransaction((t: any) => {
          return t.get (ref_02).then ((doc: any) => {
            const data = doc.data ();        

            const update: any = {};

            if (doc.exists === false) {
              update ['tabla_' + data_after.ano] = data_after.monto;
              update ['tabla_' + data_after.ano + '_' + data_after.mes] = data_after.monto;

              update ['cantidad_' + data_after.ano] = 1;
              update ['cantidad_' + data_after.ano + '_' + data_after.mes] = 1;

              t.set(ref_02, update);
            } else {
              const new_count = data ['tabla_' + data_after.ano] + data_after.monto;
              update ['tabla_' + data_after.ano] = new_count;

              const new_count_2 = data ['tabla_' + data_after.ano + '_' + data_after.mes] + data_after.monto;
              update ['tabla_' + data_after.ano + '_' + data_after.mes] = new_count_2;

              const new_count_3 = data ['cantidad_' + data_after.ano] + 1;
              update ['cantidad_' + data_after.ano] = new_count_3;

              const new_count_4 = data ['cantidad_' + data_after.ano + '_' + data_after.mes] + 1;
              update ['cantidad_' + data_after.ano + '_' + data_after.mes] = new_count_4;

              t.update (ref_02, update);
            }
          });
        });
      });
    }

    return 0;
});

// API REST
app.get ('/get_custom_token/:uuid', (request, response) => {
  try {
    const uuid = request.params.uuid;
    
    admin.auth ().createCustomToken (uuid)
      .then((customToken) => {
        response.json({
            token: customToken
        });
      })
      .catch((error) => {
          console.log ('Error creating custom token:', error);
      });
  } catch(error){
    response.status (500).send (error);
  }
});

// 
app.get ('/check_usuarios_limite_superado/', async (request: any, response: any) => {
  try {
    const date = moment ().format('YYYY[-]MM[-]DD');

    const collection = await db.collection ('Usuarios_Limite_Superado').doc (date).collection ('Usuarios').get ();

    collection.forEach(async (doc: any) => {
        const usuario = doc.data ();
        await db.collection ('Usuarios_Viajes_Programados').doc (usuario.dni).update ({
          nro_viajes: 0
        });

        await db.collection ('Usuarios_Limite_Superado').doc (date).collection ('Usuarios').doc (usuario.dni).delete ();
    });

    response.json({
      status: 'OK'
    });
  } catch(error){
    response.status (500).send (error);
  }
});

// Contact App Module
app.post ('/app-contact/', async (request: any, response: any) => {
  try {
    console.log ('request', request.body);

    const mailOptions = {
      from: `${request.body ['fullname']} <${request.body ['email']}>`,
      to: 'alainhuntt@gmail.com', // Cambiar esto por el correo de la empresa
      subject: 'Contacto | Dircetur',
      html: `
          Nombre: ${request.body ['fullname']}
          E-mail: ${request.body ['email']}
          Mensaje: ${request.body ['message']}
      `
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          response.json({
            status: 'ERROR',
            info: info
          });
        } else {
          response.json({
            status: 'OK'
          });
        }
    });
  } catch(error){
    response.status (500).send (error);
  }
});

// Get Certificado
app.get ('/get_certificado/:prestador_tipo/:id', async (request: any, response: any) => {
  try {
    const prestador_tipo = request.params.prestador_tipo;
    const id = request.params.id;
    // const completo = request.params.completo;

    if (prestador_tipo === 'alojamiento') {
      const alojamiento: any = await db.collection ('Alojamientos').doc (id).get ();

      qr_code.toDataURL ('https://www.dirceturcusco.gob.pe/' + 'alojamiento-cartilla' + '/' + 'alojamiento' + '/' + id, (err: any, url: any) => {
        const doc = get_pdf_alojamiento (
          alojamiento.data (),
          alojamiento.data ().nro_certificado,
          url, false);

        let finalString = '';
        let stream = doc.pipe (new Base64Encode());

        doc.end ();
        
        stream.on ('data', (chunk: any) => {
          finalString += chunk;
        });

        stream.on ('end', () => {
          console.log (finalString);

          response.json ({
            base64: finalString
          });
        });
      });
    } else if (prestador_tipo === 'agencia') {
      const agencia: any = await db.collection ('Agencias').doc (id).get ();

      qr_code.toDataURL ('https://www.dirceturcusco.gob.pe/' + 'agencia-cartilla' + '/' + 'agencia' + '/' + id, (err: any, url: any) => {
        let doc: any;

        if (agencia.data ().solo_digital === undefined) {
          doc = get_pdf_agencia_fisica (
            agencia.data (),
            agencia.data ().nro_certificado,
            url, 
            false
          );
        } else {
          doc = get_pdf_agencia_virtual (
            agencia.data (),
            agencia.data ().nro_certificado,
            url,
            false
          );
        }

        let finalString = '';
        let stream = doc.pipe (new Base64Encode());

        doc.end ();
        
        stream.on ('data', (chunk: any) => {
          finalString += chunk;
        });

        stream.on ('end', () => {
          console.log (finalString);

          response.json ({
            base64: finalString
          });
        });
      });
    }
  } catch (error) {
    console.log ('error', error);
    response.status (500).send (error);
  }
})

// Funciones
function pad (num: number, size: number) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function get_pdf_alojamiento (item: any, nro_certificado: number, url: any, completo: boolean = true) {
  let fecha_aprobado = moment (item.fecha_aprobado, "DD/MM/YYYY");  

  const doc = new pdfkit ({
    size: [612.00, 936.00]
  });

  if (completo) {
    doc.image ('data:image/png;base64,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',
    470, 30, {width: 100});

    doc.image ('data:image/png;base64,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',
    250, 10, {width: 100});

    doc.image ('data:image/png;base64,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',
    30, 30, {width: 100});
  }

  // QR CODE
  doc.image (url,
  450, 680, {width: 100});

  doc.moveDown ();
  doc.moveDown ();
  doc.moveDown ();

  if (completo) {
    doc.font('Helvetica-Bold').fontSize (18)
    .text('GOBIERNO REGIONAL CUSCO', {align: 'center'});
  } else {
    doc.font('Helvetica-Bold').fontSize (18)
    .text('                       ', {align: 'center'});
  }

  doc.moveDown ();

  if (completo) {
    doc.font('Helvetica-Bold').fontSize (15)
    .text('DIRECCIÓN REGIONAL DE COMERCIO EXTERIOR Y TURISMO', {align: 'center'});
  } else {
    doc.font('Helvetica-Bold').fontSize (15)
    .text('                                                 ', {align: 'center'});
  }

  doc.moveDown ();
  doc.font('Helvetica').fontSize (10)
  .text ('               ');

  doc.font('Helvetica').fontSize (11)
  .text('De conformidad con el Decreto Supremo N° 001-2015-MINCETUR', {align: 'center'});
  
  doc.moveDown ();

  if (completo) {
    doc.font('Helvetica').fontSize (12)
    .text('N° DE REGISTRO', {align: 'right'});
  } else {
    doc.font('Helvetica').fontSize (12)
    .text('              ', {align: 'right'});
  }

  doc.moveDown ();

  doc.font('Helvetica-Bold').fontSize (20)
  .text('N° ' + pad (nro_certificado, 4) + '-' + fecha_aprobado.format ('YYYY') + ' EH – GR / DIRCETUR', {align: 'center'});

  doc.moveDown ();
  doc.moveDown ();

  if (completo) {
    doc.font('Helvetica-Bold').fontSize (20)
   .text('CONSTANCIA', {align: 'center'});
  } else {
    doc.font('Helvetica-Bold').fontSize (20)
   .text('          ', {align: 'center'});
  }

  doc.moveDown ();

  doc.font('Helvetica').fontSize (12)
  .text ('Mediante el presente, se deja constancia que el hospedaje:', {lineGap: 3});

  doc.moveDown ();

  doc.font ('Helvetica-Bold').fontSize (16)
  .text (item.nombre_comercial.toUpperCase (), {align: 'center', lineGap: 3});

  doc.moveDown ();

  doc.font('Helvetica').fontSize (12)
  .text ('Ubicado en: ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.direccion.toUpperCase ());

  doc.font('Helvetica').fontSize (12)
  .text ('Distrito: ' , {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.distrito.nombre.toUpperCase (), {continued: true, lineGap: 3})
  .font('Helvetica').fontSize (12)
  .text (', Provincia: ' , {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.provincia.nombre.toUpperCase (), {continued: true, lineGap: 3})
  .font('Helvetica').fontSize (12)
  .text (', Región: ' , {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text ('Cusco'.toUpperCase ());

  doc.moveDown ();

  doc.font('Helvetica').fontSize (12)
  .text ('Ha cumplido con presentar la DECLARACIÓN JURADA de conformidad con el Decreto Supremo N° 001-2015-MINCETUR, como HOSPEDAJE SIN CLASE NI CATEGORÍA.', {lineGap: 3});

  doc.moveDown ();
  
  doc.font('Helvetica').fontSize (12)
  .text ('Siendo la Razón Social: ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.razon_social.toUpperCase () + ' ', {continued: true, lineGap: 3})
  .font ('Helvetica').fontSize (12)
  .text ('N° de RUC' + ' ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.ruc.toString ().toUpperCase ());

  doc.font('Helvetica').fontSize (12)
  .text ('Representado por: ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.representante_nombre.toUpperCase () + ' ', {continued: false, lineGap: 3})
   
  doc.moveDown ();
  doc.moveDown ();

  doc.font('Helvetica').fontSize (12)
  .text (fecha_aprobado.format ('[Cusco, ]DD[ de ]MMMM[ del ]YYYY'), {align: 'right'});

  if (completo) {
    doc.font('Helvetica').fontSize (9)
    .text ('ESTA CONSTANCIA ES INTRANSFERIBLE Y DEBERÁ FIGURAR EN UNA LUGAR VISIBLE DEL ESTABLECIMIENTO. TODO CAMBIO DEBERÁ SER COMUNICADO A DIRCETUR. ', 72, 800, {align: 'left'});
  }

  return doc;
}

function get_pdf_agencia_virtual (item: any, nro_certificado: number, url: any, completo: boolean = true) {
  let fecha_aprobado = moment (item.fecha_aprobado, "DD/MM/YYYY"); 

  const doc = new pdfkit ({
    size: [612.00, 936.00]
  });

  if (completo) {
    doc.image ('data:image/png;base64,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',
    470, 30, {width: 100});

    doc.image ('data:image/png;base64,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',
    250, 10, {width: 100});

    doc.image ('data:image/png;base64,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',
    30, 30, {width: 100});
  }

  doc.image(url,
  472, 710, {width: 75});

  doc.moveDown ();
  doc.moveDown ();
  doc.moveDown ();

  if (completo) {
    doc.font('Helvetica-Bold').fontSize (18)
    .text('GOBIERNO REGIONAL CUSCO', {align: 'center'});
  } else {
    doc.font('Helvetica-Bold').fontSize (18)
    .text('                       ', {align: 'center'});
  }

  doc.moveDown ();

  if (completo) {
    doc.font('Helvetica-Bold').fontSize (15)
    .text('DIRECCIÓN REGIONAL DE COMERCIO EXTERIOR Y TURISMO', {align: 'center'});
  } else {
    doc.font('Helvetica-Bold').fontSize (15)
    .text('                                                 ', {align: 'center'});
  }

  doc.moveDown ();
  doc.font('Helvetica').fontSize (10)
  .text ('               ');

  doc.font('Helvetica').fontSize (11)
  .text('De conformidad con el Decreto Supremo N° 005-2020-MINCETUR', {align: 'center'});

  doc.moveDown ();

  if (completo) {
    doc.font('Helvetica').fontSize (12)
    .text('N° DE REGISTRO', {align: 'right'});
  } else {
    doc.font('Helvetica').fontSize (12)
    .text('              ', {align: 'right'});
  }

  doc.moveDown ();

  doc.font('Helvetica-Bold').fontSize (20)
  .text('N° ' + pad (nro_certificado, 4) + '-' + fecha_aprobado.format ('YYYY') + ' AV – GR / DIRCETUR', {align: 'center'});
  
  doc.moveDown ();
  doc.moveDown ();
  
  if (completo) {
    doc.font('Helvetica-Bold').fontSize (20)
   .text('CONSTANCIA', {align: 'center'});
  } else {
    doc.font('Helvetica-Bold').fontSize (20)
   .text('          ', {align: 'center'});
  }

  doc.moveDown ();

  doc.font('Helvetica').fontSize (12)
  .text ('Mediante el presente documento, la Dirección Regional de Comercio Exterior y Turismo  DEJA CONSTANCIA que la agencia de viajes y turismo denominada:', {continued: false, align: 'justify', lineGap: 3});

  doc.moveDown ();

  doc.font('Helvetica').fontSize (12)
  .font ('Helvetica-Bold').fontSize (16)
  .text (item.nombre_comercial.toUpperCase (), {continued: false, align: 'center', lineGap: 3});

  doc.moveDown ();

  doc.font ('Helvetica').fontSize (12)
  .font ('Helvetica').fontSize (12)
  .text ('Se encuentra inscrita en el Directorio Nacional de Prestadores de Servicios Turísticos Calificados, bajo la clase de:', {align: 'justify', lineGap: 3});

  doc.moveDown ();

  doc.font('Helvetica-Bold').fontSize (12)
  .text (item.clasificacion.nombre.toUpperCase (), {align: 'center'});
  
  doc.moveDown ();

  doc.font('Helvetica').fontSize (12)
  .text ('Modalidad en la que ofrece y comercializa sus servicios: ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text ('Exclusivamente digital'.toUpperCase ());

  let razon_social: string = item.representante_nombre;
  if (item.representante_tipo === '1') {
    razon_social = item.representante_razon_social;
  }
  doc.font('Helvetica').fontSize (12)
  .text ('Siendo la Razón Social: ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (razon_social.toUpperCase () + ' ', {continued: true, lineGap: 3})
  .font ('Helvetica').fontSize (12)
  .text ('N° de RUC' + ' ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.representante_ruc.toString ().toUpperCase ());

  doc.font('Helvetica').fontSize (12)
  .text ('Domicilio legal: ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.representante_direccion.toUpperCase ());

  if (item.representante_departamento === undefined) {
    doc.font('Helvetica').fontSize (12)
    .text ('Región: ' , {continued: true})
    .font ('Helvetica-Bold').fontSize (12)
    .text (item.representante_region.toUpperCase (), {continued: true, lineGap: 3})
    .font('Helvetica').fontSize (12)
    .text (', Provincia: ' , {continued: true})
    .font ('Helvetica-Bold').fontSize (12)
    .text (item.representante_provincia.toUpperCase (), {continued: true, lineGap: 3})
    .font('Helvetica').fontSize (12)
    .text (', Distrito: ' , {continued: true, lineGap: 3})
    .font ('Helvetica-Bold').fontSize (12)
    .text (item.representante_distrito.toUpperCase ());
  } else {
    doc.font('Helvetica').fontSize (12)
    .text ('Región/Provincia/Distrito: ', {continued: true, lineGap: 3})
    .font ('Helvetica-Bold').fontSize (12)
    .text (item.representante_departamento.toUpperCase ());
  }

  doc.font('Helvetica').fontSize (12)
  .text ('Fecha de inicio de operaciones: ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (moment (item.fecha_ins.substring (0, 10)).format ('DD[/]MM[/]YYYY').toUpperCase ());

  doc.moveDown ();
 
  doc.font('Helvetica').fontSize (12)
  .text (fecha_aprobado.format ('[Cusco, ]DD[ de ]MMMM[ del ]YYYY'), {align: 'right'});

  if (completo) {
    doc.font('Helvetica').fontSize (9)
    .text ('ESTA CONSTANCIA ES INTRANSFERIBLE Y DEBERÁ FIGURAR EN UNA LUGAR VISIBLE DEL ESTABLECIMIENTO. TODO CAMBIO DEBERÁ SER COMUNICADO A DIRCETUR. ', 72, 800, {align: 'left'});
  }

  return doc;
}

function get_pdf_agencia_fisica (item: any, nro_certificado: number, url: any, completo: boolean = true) {
  let fecha_aprobado = moment (item.fecha_aprobado, "DD/MM/YYYY"); 

  const doc = new pdfkit ({
    size: [612.00, 936.00]
  });

  if (completo) {
    doc.image ('data:image/png;base64,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',
    470, 30, {width: 100});

    doc.image ('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABcCAYAAACYyxCUAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH5AgVEC8izezFoQAALKhJREFUeNrlnXe45VV57z/r13c9vZ/pvTPM0HsZqiIlCoQoifeqKCZG4xU0mpjgtURzzSVgTzD2iIKAAlKkDSBDHYbplWFO77v/2lr3j7XPNGaYGT3A+Nz3efaz96+utd7veusq2+ToJhuoAZLV3/5+188DykD+EO+YDqSAGIje7ka9EZlvdwXegKYB56ABORmYAryy1/U08M/V3y++wXskcDVwJRACx6BBHHm7G3ggMt7uClTrMAU4F2ionqsHPgysBn4H/DewjX070Gzg99Xn6g5RRhPwHHA30A18HphUvWYDx1bf5x4NzHi7SQCLgY+hVQrAcjQ4W6rHeTRDx68bwFzgHnRvX/EG77fQzN9UPV6JVn3jz4TAO4EPAmcBZwONbxcz3mpAPKAD3SvHKQYeBUrAjOq5WiCLBmuc5F6/W4F2YCqwHrgEbSMORDXV971aPVbVT7Z6nEaD+3Pggeq5mdXvBG+x1LyVgDQC/4hmXrjftTywDm0rADajmT5pr3uyQHP191LgETQDv4kG+qKDlNuONuT91eNWNMNXV48XVOsWV69tBF6qXqsD/gEtsW8Jr95KQIarDT0OcA5wfSWwDC09a9C242Po3jsDDUIIZIDJ7PGWFHAX2r7sLyV2tbwALZmLgE8CTwJPVe85q1p2DLwPDW6lem0eMB/dYY4G9f4Hk1Fl4tVoo2tVz9cCtwPH73WvW73eVGXssdXzSeBdwAeA84GWvd5tHiaDDLQtmlst8wLgVDTTAdqAO9ASAFoix1WUA3wP7Z29ZWT98a94HbUBJ6ElogB8Ct3DngFGgcfRjF5VvX9B9fwQWo20oyWkhAZof5IcPsnqe4cOcG3cu+tG25l2tM2oA3qBU9Bq8v43gUdvGbnAe9GMbKw2+hvA/0QbT9BB2t1oFXQC8Am0cbZ4e9xOD+3yXlytexotnd9FS/jhkDjM+w5Jf0xg2IZWQTl0D3PQvXo9Wj2M+/VZdG87FXioev/xaDuwFW2Y+9C9OT6SCkwQRWgJ2oKWzAitZs8DbqteM6ofdYDnBVolSrQL/rbRhWjdngL+Fh1LjNM8tOE8d6/jX6PthIvW1c7hFvQ2kAMsAa4CrkBLT/1B7rWBfwO+jHYc/ij6YyRkBBirfgbQ3swOdNA1iJaMZWibsRjoAp5G98Acb480HC7FaKndhAZnrNq2A9FfoMH7BnApWtKKb3WFXbSE7B0nLAbew56eP+41fQKtoo5mifhD6UR0hzsRbXduR6vmP5j+UAmZA9yA1psvVM/1oQOrNmBn9VwvOoDbwNEtEUdKFtpD+yfgl2g78lG0VvgBWkI60HHTW5JdFmh39Tfo3M84ZYFrqhUWTKD3cZRRPfB/0dlmgXaVj2NPJsEGbgKu503UDBYahCXsyUWdhwZlUfV4LtoI/v9AU9FR/P5kA38H/Ig93tphu/OH24Ot6svPqH6+DfxX9dpfAJcBj6GDwfvRRn1i6ZzpILCJpE2sKkytEYz5KXJ+kT3q0CTrpqlxi2wflViGh2OGKBXy4LYJr1KVf3u7wjbw1+jA9yPAWrTL34COvQ7rhYdzz7XoHnET2pifh84zKbR/Phvt/q5HxyITR++YDbG0SNiNNKX+EqmOB75M1j2NIJ7DUOk+/GgIicA1G2hKXYhjbiLvPw7ciBCrGCzeRjkawhAhv970x9boQGSgbec16AGwW9BOzeYqPzy0HT0kHY5RT6F15DvRUewO9GDReJdTaIno4fVZ3D+OVkyH+zbDY/91GbXeTQhxMaaYh2cNEsaXkPd9bPNabHMFCftCLONi/GgY0zgBxxTA1RhiCRn3NFJOkZ+uWcfTP4KtEz5YqICF6LzX36NTQNPQkvEcOiwYz6tVOHCACRxaQvYWyVnAv1QB+XsmWhL2p8vnQc73mFxzCa71NZTK4UfDKF4jlk/w6piHZZxEZ3Y2SbtAGEtKYQ19xQ2E8dNMqa1gGachmIxr1SFELUH0v9iZ+xVZp8Iv1090jQXasKfQQXESncsb97LqgBvRXtmqg73kjSSkDa2eutGoDqOHTN+JdntfRScNFRNNH1oO6wZcFjS/F9v8V2JpkQ9+y/bRe3mlfxUjlTZa08toy8wh48whkikUjaScdjIOKFw2DY2wefhxArkZz4qxjYXY5kXUuoNsGFzLpXNjnu2e6Jp3o7PS70AHv73V87OAL1RB84FdHCTNcjBAXOB0dKQaVl8i0RHrM+ikWxdaR04sXTYXBksW85tuxBRXEska8sGPeGLnc7SmT2BO4wqm1V5Axl1AwnIQFJHqRyhexDWnYZspEvYcOjKLaUlPI4hTvNDzFC3pXmxjEaYxndZMCztGn2RRs2TDhPsf3cD2Kn8k2t5+CZ2l+BzaNT4GePlADx9MZV2Mloin0V7VNPQQZ6Z6fjJaQiY+6Hn3AoDJNCbvIIgjBorP0VsYYUrtDLLOPDy7ESlXUY5+TCVaQ8ZRvDKwHaVgUctU8r7AsxbiWX+BaZxAJRwkH2xgx+gWWtJ1NKeW4Zg2g8XLgZ3cvm7Cm1ClTnSW+xj0JI25aNvy5+jo/uYDPXSg8ZAW9DCrQKukDFonRsCZaLW19U1pQl0C5jVCf/ECDDGDQnAHm4e3Ma/xEmq9hbimhSFeZLD8KTqyW/n+SzC8l+T/ftdW6hJw7ZItdOdfpiX9PRL2UgxjEp3ZNtYP3k3S9mhMXkFD8gKaU9+hPrHvOyaOBtDjPP+A9rIuRDs/zwE/PdhDB1JZMTqmaEOnR7YBD6IHb+ajfes3J8188WzoyteTdT+OlLB15B4akpOYlJ1DwkqAWEve/yw/XrMaBGw+wLhTJQIh4LdbRpjftAXPmo9j1OJZAVINMlx+hcbEDIRoZPPwQ8yoL7N+4M1oTYyWiD50sLwFPf6/kj0OkYf2vnanlQ4ESIQ24qvQkvBedJyRqRaw60hqtXQBTGrDWr6IZDpFNKUDtav3IDefNRUS1lRc85Pkw0FKYZlptVOwjXqEeA0pv8WD2x7gpE7FIzsOXuiuHFw4E57p6mJ2fQEhpgIeaUeR8y0SViNJew6edRdZd/Bgxn35ImhuRCxbRLomjWxpRPYeGXZRleFXAr9F25dxEuipSPPYK0bZX2W51ZfEaO/psSqy/1T93nhE1QFmTIZYkn73RXyltQmzq48v33AdWy770AFu7ikAjFDnrcSPHPzoeWJVxjJPxhQRQ6XnOXmS5CdrDl3wfVvgmkWS0coLNKfTCNFGKbofP34FP55EKdzJSOWgAcmvvg35EjM7Wrihpx95+73cYJqMvnjkJicC7mTfYeTpwPvRo6YPoM3EfKB3b0DOBK5Dq6gvon1oqqh+AS16r6OTl4Fl4p1xInOb6hl4/hV6Ey7xt36sr9fXwrd/wuijP2NzNs2X8iUKv36WG279Gv71n9zvZR0ZqEQL8ayZDJbuxLFm4lnnIUgCAsc0jyhf6VqgMBEYCBJ41gocw6cSPUdz6goMsRDPep283vo1uPcF3IuP46M1Gf5SCD59528Zve6aPfd85L1Q8TGXzqe1b5DGx1axMYqoPP3CAWvyBFpSbPTMlsvRdvmDVb6m0Q3Ljs/caEeni7+BHuNYgs5SdqAnLPRxELvR2gSFEmrZQj5+3GJWXn4+5193Dcyaqq9/56fw81thxy6+3TPIObluM3F6i3VjsY7kN27Z72WxBKXWEcQD1LgzMUSeIO7HECPEagjTSJM4gnkZngWmSBOrIYQYJoj6MYw8WXcWQdyHUmuJ950z8Y1boFhH4rQW64Zct5nsGeSc7a/x7f++Bb79E33PrGnwoavh0hWcf9xinli+mE8US6i2poPWJEaHD2dXPzegXeEutASFwPPAM+Otu6rK8KfQLu3H0DFHAp0Ue+pgJa3dBHd8C7+rjx+YBgsVXPfoy2z4lxvZ9uEt0Ps1uPKjAOSfapn8+KAfLuucHX+l/oxc6/aZlX/8xa30X/csDH4fWNUFgRzgxI4tCDEJP6rFj35LaHVgmy24ZhHnCABxLRAUMUUzYZzDj+/Hj5owRB1KbWVV9yCO7pONfwnfPA76LJoXbPQ+7z6a/Z+7Npk31Lv24+/o27n7la2fhH+ZCY+8zPSpDVxnGIwmPX7wg/+Df8V1h6xRLXpq0d6TxpNoW5IBfmSgJyh0o0e9vo+Owr+FVlsfQ4f6B6WN2+Dr/wHf+xm/e2oLZ4697NwzuSvx7zlfzF/VZnH5Tfq+M+wkJ/ftNFpje2nthpTddm/jh2atTt2WU8x9conJZf8EjPmwpi/CMkZI2lNpTVcoh3raZygrhDLEP4LQx48glBGh9IEs5RDa0j5JexqWMcyavpAxn0s/DyuXmOQVc2euTt3W9pvG62o3pOzW2F56ct9O4ww7CcDlX4Dft1rkfDF/clfi5rE1zj1Pb+XM7/yU3/3rdzUvDkEvoMdSbLQGOhbtgQ2jvS/bRIvLK+i0eYCeyTcVbYT6eeO1F7qUtbB2M1z7ZEegnk0xrTv1uYTFinVt/qYvnKF2fHI+TH40y2l2sm6R5f2dJURbeswW3i53lmNy6qZWf+P//iu14+wtiu0vhPDr7x6LY15KEEf0FSNqvF2YYiH5YCPbRjZwTKs6ZIR96Vzozpt41go86x348QPsyrnUeYvJuMcQq4d4tuv3Z730ee7/x4iTXhRndj6X+W7Lw/WnJfscEQiFKUTcZJi3dxp2+cSvlPnPM+G41zi74/ns9xoeqls0/Gjyy5nHsjtuWpfnpcMz9iPoLPDJaO9KoEdUN6JjlthkTy4qQrtfv0VnJc8H7mXPtMpD0hVuFmmq5s6K+77szsRUKxLnXhyGQzvb5dr5T6RlbcWYO9mw/1oKkXQMgV02Sez0Wp1YnHtRfzhYXBKs23LHfbLiCx/TWIRpdOKYPURxB4oSpnEytjlMV34nQRzhWoKsC8Vqkrk5BY4pyLoCx0zRmrmIhP03BHKQSpgg4/pk3aXY5hbgu3XPfK/3zONetW542Lqm7amaW5ser5vt5i2UAT4KR+H4Mr67qVb09l5asv9utfW+tqdqbml+vG6mkTdLvUb0fUOIvl8Gh+yze9PO6mcDej7zPvw9UBziV298gT3JscOiy5wMEppbDetaNzKSyV1exiqa5zSkQnvVF/PPzHh08RmNrnd1WK4IF4EQYIaC5Gte1i6Z57amQmPelJ0vbMzV78wNqx4yzrWYRpJRfzvFYBOxTJC030Fz6jJmNpgsaDqXWQ2vckJnnuXtMKO+g/nN1zGjfi5NyS9iGedQDLrIBy8TK2hILCVhdTLmf2JSTfDUJ2a+mD5hq/O/2h6r+0LjqmyTFRggdA8tC7CaGrx8c+OTz925cfMZjzufbnu07p8bV2UbrdAgEpR6VfR9Af13HBkgVEEIDnThYMnFCC1CR0SXOhlUFRBbiKRQgkSP69rD9im1Q5VJUz7x9bnTP/iRxcVyCXP1OgwhQMD4fc6wfWraiztPae+qLDaKzz3qt+zEEO3YRppCWKa7sIqE3YsQxyCYhGW2E8hJd89/YcsKrzt7V3/rh7DEUmK5kEg1UY7uZVduNSmnk+ZkB541hjL+/cPuhseuannt9OnbEp9qfaT+o7Vr00lDid0etZQScc0VTPm3Lwp5+sxK7U/uOL/jd43X169NJ4xqRwrRgAD9dx45IAelCZ3bW114IdkrJS8E1G1O2rLYcW3dn9lx3dxZjF68gtyvHyQxkgNTezkCqNmYtHPN6trHO065sqZx5M67mp75yqcfaLxz3ZQpH2B6/Sm0ZX1GKx0UwtWWDKPlrfmnG9rS17/iLfizE2Y0iL9SQ+Xnt/fdumYoe5IynUE8exZL2pJ41hTK0cq6Jzd89xvvKUzpWHDRvydT7ZdV/s89Xs2GhNinW8aSoC5L9uIV1M2dRd3AhnfHD3SYdd2Wsd/0bgXIiR57mHBA9uCyh4RQpKNmo6FxjgGQOW4pxs1fpPDVWzBfXo9hmggJxc4Kv1q0VNyWvzpRI8b+fK03/6x3nvvKg6eW+wZfrCTaS65YamRVa62JanZTY7G38NJXomPrhnN588oVJ/LVE9riDZvv/pdH1j4dPd07VNNdCUVI2JNx6F0xVbaueMcpNzd3nrOiffplbV6qhY2DNsXNd5Lq9sAAFcdEi+ZR+6nrSR23FICGxjl2JWpGiCHUvkGpUm/CWNCEAiJRVQlRcu+IWkmJnNxBoqMVANOyaLngHOoWzaf7i18nvvN+VKrMA+e288PEuwily6Bq5r7SxW1PGqe8r8Xsj2sTo35NIjB8HKdH1Ys1cZOXq2SRyqHWeh7L9mhoO8k8ufX4huXLB8mPbSNX6FZE5ZaEm252ky3HeempZiLVghC6q0+/6DOs37UD/6svYVWSiMsvYtJnPo7T2U65pPN/iY5W5OR2VN8AmHtESaGkRMUTPc9pQgGJdH+J1X5LBpRSMGcGZjKJUgrDMFBSkp0+Fe//foldi2bwxCvf5dbGKxiL6xl/XAkYU3WMRfUmSiQRgIwxKzmE66IM2H91ghAmbrIFN9lCI4hHN72QMLAYG8ozTZZYmN6jd5LJNqZd889s6v0oDS3vZsoHPoiTTlIul3UdlcJMJmHOTNSql/ZP2shYHdHSiLceEIkChNyfS7FpkN+wmW0f+DhGMoE45zTazjsLACfpMnSqxS2ld7CzPL36+D5w6s9ubsRM6X6Sq2rXs8Gcxl2Zi/ZRJaPFHAnXw7UcYinJhyVue/I3CAGfOedapFIYQlD0y0gpqW9ayqTrPkOl1IOV1NOn4jim/+HH6Ht4JbJUJv/qTmzT2J9ZUmptcDQDAgK1r1EHIgTec6sxnl2NkorSk88QLz8G0ml2bP01X358Pc+VTz4AGAcgw6G2vZWrjm+mLBNUXtlEz16m9a51K+nJD3FS5wKCKOCHL/6Wk2pnkJc+//bk7Vx/3KUUwwoPbH2W82cdz9mzl9M2+QJ2bPg+Pa/eS8e0dxIPj1D8538lsXkHhiHwBESGic0+7FcK9adh1Pc3diEKxzARQoBS2PkiqlhmePBFbn7kfu4ZPhGMvWPUNy6lzRgjIWOeSJ/FYKIPQ20EBLGCumSWpze9xBNbX2JGfTt/tvAsOnyJtG22xUW+9cyvKPglmr0akm4CqSSGYTJp5nvYtu47DA++iFFIYeeLCNtCCIGjFCGKxN52sdrOox6Qalwl9z4Xo0gKodktBKpYYuSVdXR3ruHX3S2ExviuF+Nk7PU0r/udoczmlx/npmguve4UlicMDCF4dsc6fvji/bx7xqmMDvRy964X2Zkf5Mr6aeRQ/LJ3A7XS4N0zTmbYVtzy1C/4p8T7mdE8CdvJUNu0nL5dD+Juno0qlnRdAVtARan9u4vkTQBkQleWxii0Xt0DyHitDamVmVAgyhX6P/slap8MubqzG48c40bCUJLWoItp/lYawgGy4QhuVERIBZgIGTFHdJMjScHK6BcCUimWT5nPl8+/jueGt6Fci/fUz6I1gJe3vszL29ewxMhyefM8Xg1GGZZFvnrR9UxtbAfA90fp3/k48UMFBj77JUS5glDaXzSkQKnXLW6UEmR8NNuQWIESSu5d91ApSpmI0owiypF43S7pXheruw/ja3dw9hlpnl5g8mB8NoaMuNR/mL9yniBlBORkAl+Z5JTHxqCVdWoSjqxwVnIDq8NOKubec5gVlqFd7Ho3zX1da5mfbuGYRCOypwtsD6utkSeCAYbLFU5Kz8cSBqahXdmudb9g7Ob7aHgkh1UsEDsGA61lKu0+IjBgq0uyYOAKUS0NGaFkPMEiMrFuLwpT7fGyhIIoFVO+YBSvIUYoQWF5kdwGj8TTGTKVCq0PFrgs+xRPdi5nfnkLf+M9RKPtIxE04TPe/JN4jdh4Bbt2EkbczG1Dy4iU+zqlsWOkl0Ut05nTOIlfrn+CzmkLmK5CErVNPOQqKAa8b/bpFIMKu8YGaMrWU64MMPSrH1N/fxemsimkJOWTxjDmVrBjAyUUlVllovsa8IrWuDDLWB3tEgIIHXVIzUawMxIXQf2djTgVE7/dJ7e0QLy8iHrSwYgtFq8bYu6kTXSoUdKmglQrhGWkPwbCqOo8i9bTP0bT8mtZt30bK+/csNdmTYJCucQPn3uAp15dTffYIMe0z+J/HHsRp848hse6biGZyvDp09/F79av4pFtL7KmbxvHdMxi+0gfy5wBxKPbsGIbZUK8vEiiNSb7SB1ut0vgxQydPoqdkaji7vm1UqLURK9CejNyWfukTsy8hYlgYG6BhuezpNem8Hpc/HZ/N6/rugTHVjbyi8S7uCrRyxxPErctIN19N0FpFKd2EsJ0yMw4i0Ck+NnmElsr5l7rYhWe4xKXFSlls6JpPg+8upqXerawc6SP2nKBMDfE956+m19vfIp6w+WStqVsKA/gODbFTc/gbI/BsBEG1A+5uGuymMMWhWzI0NwCNgIzvw+7/hS8LIXSVlbXU4BZNGj4fZbhs0bpnzxI/oUUdVuSJNcnd6+xsgoms8Z6GWtyeCKYzjyxmd7mc+mvWciSBomZaqOw+gcMlRXPP7aS36x5DURin7Id0+acmctYtWMNU+pbuDZaxFPDO/jRSw/wzmLIWH6QJ/o2cKLbyInNMxlOJ3DJcdKkWey8dxNuoTp/QkJyfZKKE9O/KEd5aZGEIah/pBazaOyTEdKAHMUqq2o89nVIBLi7XJruaqS4qEj+hAI9C0okXk5Ruz2B55sYyqC+WMJu9hkQtYia6ewMXT7/vMWcpizTZDcfqJvCzx7dwj3ru9jl1O27n1C1nP6xYSbVNvOL155jRfsCzjCnM2PgNWRuLWnL4eqpi2hoaONVT/Bc/3rmN02lb7QbNTCCGWuHs+LGjE4tU15SxE5LGjalSK1JYeX2nfCiII61E3b0AhIqhRIH2ABAgJUzqXkyS3J9kuKiAvlT8/QsLuKtSVG33cWMYgwkCVOwnansKkb0Borerjw5pwRTZ9BbTLDDa94nybe7MyjJssmz8SwLoVZy+/ZnWNoyk7aaOjwklmWTy2ZZG42wq2eA4zvm8udLz6PWU6zxQ8pOzNiMMpVFRayspG5LgtTDaexha3cb9i8yQslogpXWxAICKKUOvCNDtUH2sEXt47Uk16UoLi5QOD1Hz2IYq/HwlGJqxuX5oJUdflk/JAT1jqSiHCIltJF/A1rQPp22bAPH7ZrLT19+mJMWnUl5YBc1je282jEJ2bWZvz7hcpZOnkPS8aj4wxQ7YkrvGsCtF9RuTZB6NI0zaO+OdA9CcaiUnOjZ5hOc7VXazQIZorAO1JrqKWfAxnmkjtTaFIUlOSqTbWqFTVg7m7UjEaNxuXqvImnbrOyPKQbBYc2Tq0/XcPqsYzmmcw41XpJ7HrsbDIP3LruAkTknUZ/OYlSBNQwHuzlBze8dalbW4PQ740m5g5YVVocZIpSKjuY4JDQFShgqkFIJpcialh4yPBBVfUe3x8EeraHUXs9Qnc2msZh1YyH1jmA8kTAYJLinT2CaFQ43uWCbFg3pGuJ4Tx82haAxU7vPfablkSy34Ty6DSdwdEr/jUBXilIcEQihQtNU0QRbkQkFxLrsIpKNDVj1rUqtXkvw7MvIsTFsYaBQGIjXsVMJiF1Fj9dAPrYYLQcopXCURAhR3RxLsaUimOpGII5w2bfS0buSB2acKSzc1ilE3hOoA6yQ1I6KQiAIlcSoqUEdtxhryQKVHO6lNDgMP/ovJoomFBBvyiRsz6Pjr64h6SUYuP1XFG78AlJJJGCgSAljH0dRKCjXSbZ57RCb7ChHpJXPYMUgqSAUJhnboFDS+aq0CigcASiBX6aUH8ZyPOI4xjyAQ5CcPI/hBhA53UF21w2o7FX3GEh/+q9pf/ellCpl7Ntuw0slJ5KFEwtIsVgkCAKlpJS2Y1N73llUHllJ+NAT2HFMhJ7vZCP20Qr97TZbjakgBdsCG0dCYNi7g5lHxxQVTF70xZ4AZze98eZyURQyddFpOG6SOAoPCEi2YzH9M9KobeHudysgqIJgAaFpYp97GrXnnYXt2KhSUeZzORWGE7vweGIBKZWwTFMppWKlFF5jA9O/8VU2ffom+MkdKCGomCZCjO/TJ5CWpDI15OT4WZbJNZofe/N33MCOc6l6bvyUVIKpcTdDr/QS7NqAOoBOb83ou1995pbXXRNCEMZ5ohkR8aMKUwoibbSpqPFoQyHecwnTv/Q5pG2jlEIpFRcKBRXFE5s8mVijHgTEhiGBuFppknV1tH/iwwzXZCk/9Szm+s1EUhIDGQSlhojmXRU+/eDTu1PpByUlGM/vK1MRJ2OIBVbZBLmBAvdVwTxS10eg5lcIGpIk+x0qKExAGQbxgjkkTj6O5v9xDcm6OvK53LijEvu+L+UEjxlOKCBVdSCFEJEQOs2opCTR2sL0mz7DyK4u+v7tW4Q/vgMVhkhMKm0+iR0eXp8HxoEbp6QgciRhIiaaX8aZX6GAJDk3wDMEhcdSMGBh5U3MzR6ObyKEOiwXGV1jZBLKbT5et0lMjLRtrD+/jI6/vY66zg78SmW3YyCEQAgRCcOQ5gTvVTqxgFgWsRZhOV5xVY1klZRkW1tIfO6T9C+cR/7FNYRBiaD0G7IbbZR5ADB0SpXSogLee8ZwW0LMmhg3raj3oFgExwFvgU+xBClT0P20i/NUhuTKrJ7/Jl7/TqVACo2/MABT4fXbFOZB+O7zEG6SzDGLaL7sYuxUajcQSik9DF2FETigTTpqAAmDAN/3VbyfXk2n0wRBoMen02kmve8q/Kv+jCjYTvFvH8cqBa+f1KogyMQEZ44hLsxhdcakPD3RsViEchEySRjLQzYNlgF2StF4WoX4mICx5pDM/XVYJWMfG1TOROTOGMNsjWCjS3ZVFicwsEoGrpmh9SsfwXSm4TrW7s403oa9j+M4plwqKded2H07J9zLGhgYwDRNmUgkCMMQwzAwTXPcEBKG4e6eVuh6AXt9HiG817nCgamI3jdI87sKWAYEPuRykElDqgqElGBbEEbowXwJKgKvRsJfjFIsmqTurdXzJ4SWityFI1SWFknXKqzTC4ykJE3312MKgbW+QL7rBeqmT9/NfNu2EUJgVaXftm1s28Y0TdnT00NTY9MfwqqD0oRqwFwux86dO5UQQtq2TTKZ3C3Stm3jOA6O4+C6LrZjUtj4HHaf2Mf3VzEUsiG5KwYxTypSKEChALYN6SQUqwuKHRuC6gpoNT4QM46q0teNS0cZXjFKkIy1Z6bAcBTOy0ly36qnfxBKS4pUEjEIcPqgsOl5bMfEdd3d9bVtnVo2TZNkMjkOUrxz506Vy+cmFJAJlZByuUxPd7fiDXZ4GG9crEoEmzeTLJu70yiRI/HPzWGdn6dueoCU4FSzL6N5qEmDISAIwbLAr6a2YgmGoY8dG6JIA5hsjbGvG6K4rIR/dy3ulgTeI1midEw+FVAuQ21NjEzFUDaxyialTZuwrAjLOmTAF3d3d6vOzs6jF5AoiiiWy0oIccgkaFAZJt7RjxEbYGp1El42QuNfjuI47B5wyBc1k1Oe/p3wNOOTCa2yhAAZ71Fdrquv22jxd2ywTy0TzvcprHcI+yzC2ojGBT5eBkZ26bIBjNggfrWfoDKMa2ffsP6GEFGpXFZRNLH53gn3sgBlGMYho6WgPIgYKOrsloIoG+GeXqTkQ6GohzySCajJwFgOvKpBl1J/dntL1RGxKAbX2SMlfrDn2FTgNkvs+gpKQRhWd0a2gI0u3qiFXh5iIPqLBOVByEx9w/oL3UZVbfOE0cR60VUlLuWhM6BRZQzye9IOIhKMDejcvWVpho/moFTWhrxc0RJQLGupCKqPhtGewW3T1OoK9jhWhtiz7Z2Q4JpgCRAmlF+1yNxTjxvuxYZ8qOt2CNrdxgkeoJpQQPxKBUDFsV78rZTC9/2DP7BXW+J0jJNRjFR5UaquvBsYhrGCdm0TnvakfB9yBS1JxZKWDs/Tz1imlopEQoPoOFWJEtrOKAHSgOIGB/nNJrJ97j5OxRsF+b7v7/a+qm1U1TZPGE2ovA0ODVVx2JPILpVK2LaNYRgEQYBpmpimiZ2oR9U6QAzSQLaH1M2KKPq6d6eSGoR0EgaHoVTSgNRkNWOF0NLQ0w9BXjA8ZCBdiVejSCSgUAE3oVdG246WLCMUDG+2Cdd4pB6vIdnj7NclFarWwU7UjzOdOI5xHAcpJaVSCcfRmeZqG1W1zUcnIP0DAyil1Pbt23NBEOz24ccDxTAMCYIAEHiZDsSsJuQj3RhCYG9IMPRQEnVCkWIJMilt1KPqp6EWCiUo9GsDbttaGupqYOT7NZiPZFENEUFnSMGSWLN9SpEgMhVOwaSyxcHLWXivumTLpsZhP/0ghUTMbsPLdFAoFAG1TwwyHqUHQYCUckwppWpqao5eQIpFveV5FIZdpVKJZDKJZVlEUUSpVMJ1XXzfR0pJOlFP8pQT8H/+cxJjJnbJJHguReK0InjaIHf1aebXZiGb0Z+BIQ2GlOC5GiSzbGIicLpcZI+DHQvMhw1t7F1JuLSIl5HYa1ycsrmviqqSUODXhiRPPh7brqdQzmMYBq7rks/ncRwHy7IIw5BSqUQURd17t/moBCSOY/r6+iiWShubIIqiyDJNcx8jL6XEtm38SkDLCe9h60m/wbsvQpjgPJ9i7IkkweISTXWQSmh7MJbXsYZlagDamrX9KJSh0G0ST61Qe+UYuZ0miVpFNGRSfC6B0RJRqQvJLK9Q26wY+leFdV8t4gDpJ6kUlZNSzDjxPfgVLd17j3VIKTFNk6qbGxWLxQ19fX3ER3P6HeCll15CSvlyZ2dnn2EYHZ7nEYYhlmUhpcQwDGzbplQuU9O8jJoPXE1xw3+Q3u5iVgycIRvlaZdUKMg42lYUihqUcVfWDzQwGS+m2F4i06gI6yOyKW3MvePKZKouswwEI6/YiF3OgYf4JRSnBdR84L3UNC2jkC+STCSI4xgp5T5pk0qlQhRFfb09PWv6+vqOmD+Hogn/p8/Ozk5++Ytf5C+88MITbNue73kefhDgOA5hHGNbFuWxHH5XDyNrN8JrPoP+U5jDIW7BRvbZVEp6HlHhNQu/IpApietAwtXZ2Xg8C+yDH2qgCkWIIw1UpaJ/l0rgSyitcxFfaSW5y3s9IBJKzT654y1q6y6kOFyCMESaJm4yQVSV6DCKcF2XcrlMoVB48MYbb/yPMAzjlStXTij/JnyzfNd1GRgYYP26dVdO6uj4gZEvOvntO1DdfRR3deGN5Bh5ZR3pXb0UxsbI+jFxTcjY0jypLQnSOz0dvKVjkIL8MQW4bAS/IGhdGBEWBIUSZJolY30GmVaJYUAYgOfsmeQSbnbJPZ4ktdBHPZIh+Wx6XzCq7m1hUoXizDI1L2Ywx2xyrkm6poZiZyu1C+dTqcuS6uxAtLeQmTYVmUkFr3V1vW/e/Pn/3dTU9MZu/dEACMDXb/oClXSy7uQnV99hv7LhzORojkqpjCUlRnUsImGYBILqzmICPx0ztqSAUTbIbEri5E2EEkhTEWQjHZVP9xFjJsqVUB8jh0ycd+QoBYrsogCvM2JotUN8Zy2JnS5Or4M09LDseL5MVGeDB5mYwuwScUJSszqNWzApo5B6jxPKMt5d18gw8JIJirVZooVzH33ylCWXJwqlkY9/7rMTzrs3BZDpwP3Z6awNiu9qsd0fJg0zYwu9rZuvVHVSNnhCECr9jQJpKgpTK1Q6fcySgTNgY+cszIqBiAUiEnoFltS5dKEgtiRKQDjJR00J9IhhlwOmHuZVApShUJYidiVhNiJoComTEm+XS3qHhxFrwCpK7V6+pufJCVwhkCi98EjG+b7Qf+8CJ3XXBbltu/daP+oBAfj7RCNrY9/+iFf3lSZh/m1SGLvLUkBeSdLCeH2qQELsKPzGAL8xJE7FKFvtcVXHV0nHAqtkknzNxR22QQoqtSHlKRWidKxHIPeafSgUiFBgFk3cQRt30MEMxOtjEaCgJBlh7MOckpJqQMVfv7UycuMC0w2/WJ74P4B4UwEB+M90GyNSNh5ved9qNKwr9m77G0+braoWxZ4ebgDVb2UqpKUo1IXF4bmFnqatqekAAzOKW+s3pNvTI3bKiISWKomWJqklS6jqGMobFL5/3SQwKKNfrooq19UZxuD7Cz1vGs/e1P9Tvyso8EGvrrRFhk9mhNGREGKeWZ0tfcieUO3desMggaEEphQYsSAORKlQ5ne9fXzaH7C2WzP98+K0FKPPJL5Ues36nhMadU5ktNuxYZtSIJRAVHfxOZz//RF7fceoeFDGt6+O/Y9PMu2+awoTvl/8WwcIwM+DHFe52fz6OHgoKYyyg5hnCZE+3KzmOHNiUGUle4ZVfNdOFX3uiaj01ZeobDk1Tn/K63Jn1+1KCLdihj+TuS/3quh2W4hn0ILQaOjyxOGqg/G/hCgp2dej4q8+G1X+odEwB64udL3Z7Hrr/iPqeq+O9XFgvN+tObbDsN+fFcYFnhCTTIR1kFiNGBUESvWWUatzUj7YrcKHfxeWNk837PBUO0lOydMnG9bdLkZNSgjKqLENsX9JjTAffyIssV2G9tl2cla7sM7JGuaKBGKJI0SriXAO1CGqa+qjilKv5ZS8v0uG/3mbP/bCPNORtxx8i98/TUDG6UNeLd0yMi+y05PbDGtZWhhLHMQUU4gaAaZUlCPUgI/aXlRyXb+M1q+KKl0f9ur848a2A3CJk+HuIC/uzUz695QwrjdAusLABKNXRrdcnH/tby5x0uruQG89/GzNNL5ZGXGPtxIdzYY5LyWM+S5imoVoMgQJBXGs1FiAerWg5OoeGT3/m7Cws92w4u9URt9S/rzt/6JmoOcfTDZsMy0MsV0GsnyIxa3/O9lEoNT0M+3Ug3XCmD6o4n4HQb1hNvfLeOtjYfE8R4htf196433BE0KY0wzHKCipdsowNt6EJWpHSm/Gv0UfEY2Pu+2U4WEPTtcJkxKq0YT66kMNphBUlMKChowwG5NCHDJMKCsVr4v93eC/3WDAn+iftntCIKBiCuGbgK9UaCNCC4EphC+g4h22CT+66E33siaaPptopEfGjcdZ3s1ZYR4rgT4ZPVBCbk8LY5aJSCeEmPRsXHngbDtVfjx6c/8qa6LpbVdZfwgZAiOv5KY6VMlDJOsN8yy9vAEqqFJeyY3Gn2Bngz9BlXVzZZhrnJp+W4hnUhiWgfB9pZ6tKPWsgfBTGJYtxDPXODX9N1eG3+7qHjH9yUlIrTBZMrZN3JpqrQuU+uagip/eFAe/A5htOmc3CvOkYRXXX5HfJSYbtsq97X7TkdH/Axd2PJwobUqEAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA4LTIxVDE5OjAxOjQ1LTA1OjAwvcTI8wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wOC0yMVQxOTowMTo0NS0wNTowMMyZcE8AAAAASUVORK5CYII=',
    250, 10, {width: 100});

    doc.image ('data:image/png;base64,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',
    30, 30, {width: 100});
  }

  doc.image(url,
  472, 710, {width: 75});

  doc.moveDown ();
  doc.moveDown ();
  doc.moveDown ();

  if (completo) {
    doc.font('Helvetica-Bold').fontSize (18)
    .text('GOBIERNO REGIONAL CUSCO', {align: 'center'});
  } else {
    doc.font('Helvetica-Bold').fontSize (18)
    .text('                       ', {align: 'center'});
  }

  doc.moveDown ();

  if (completo) {
    doc.font('Helvetica-Bold').fontSize (15)
    .text('DIRECCIÓN REGIONAL DE COMERCIO EXTERIOR Y TURISMO', {align: 'center'});
  } else {
    doc.font('Helvetica-Bold').fontSize (15)
    .text('                                                 ', {align: 'center'});
  }

  doc.moveDown ();
  doc.font('Helvetica').fontSize (10)
  .text ('               ');

  doc.font('Helvetica').fontSize (11)
  .text('De conformidad con el Decreto Supremo N° 005-2020-MINCETUR', {align: 'center'});

  doc.moveDown ();

  if (completo) {
    doc.font('Helvetica').fontSize (12)
    .text('N° DE REGISTRO', {align: 'right'});
  } else {
    doc.font('Helvetica').fontSize (12)
    .text('              ', {align: 'right'});
  }

  doc.moveDown ();

  doc.font('Helvetica-Bold').fontSize (20)
  .text('N° ' + pad (nro_certificado, 4) + '-' + fecha_aprobado.format ('YYYY') + ' AF – GR / DIRCETUR', {align: 'center'});
  
  doc.moveDown ();
  doc.moveDown ();
  
  if (completo) {
    doc.font('Helvetica-Bold').fontSize (20)
   .text('CONSTANCIA', {align: 'center'});
  } else {
    doc.font('Helvetica-Bold').fontSize (20)
   .text('          ', {align: 'center'});
  }

  doc.moveDown ();

  doc.font('Helvetica').fontSize (12)
  .text ('Mediante el presente documento, la Dirección Regional de Comercio Exterior y Turismo  DEJA CONSTANCIA que la agencia de viajes y turismo denominada:', {continued: false, align: 'justify', lineGap: 3});

  doc.moveDown ();

  doc.font('Helvetica').fontSize (12)
  .font ('Helvetica-Bold').fontSize (16)
  .text (item.nombre_comercial.toUpperCase (), {continued: false, align: 'center', lineGap: 3});

  doc.moveDown ();

  doc.font('Helvetica').fontSize (12)
  .font ('Helvetica').fontSize (12)
  .text ('Ubicada en ', {continued: true, align: 'justify', lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.direccion.toUpperCase (), {continued: true, align: 'justify', lineGap: 3})
  .font ('Helvetica').fontSize (12)
  .text (', distrito de ', {continued: true, align: 'justify', lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.distrito.nombre.toUpperCase (), {continued: true, align: 'justify', lineGap: 3})
  .font ('Helvetica').fontSize (12)
  .text (', provincia de ', {continued: true, align: 'justify', lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.provincia.nombre.toUpperCase (), {continued: true, align: 'justify', lineGap: 3})
  .font ('Helvetica').fontSize (12)
  .text (', región ', {continued: true, align: 'justify', lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text ('CUSCO', {continued: true, align: 'justify', lineGap: 3})
  .font ('Helvetica').fontSize (12)
  .text ('; se encuentra inscrita en el Directorio Nacional de Prestadores de Servicios Turísticos Calificados, bajo la clase de:', {align: 'justify', lineGap: 6});

  doc.moveDown ();

  doc.font('Helvetica-Bold').fontSize (12)
  .text (item.clasificacion.nombre.toUpperCase (), {align: 'center'});
  
  doc.moveDown ();

  let tipo_agencia: string = 'Presencial';
  if (item.canal_digital === '1') {
    tipo_agencia = 'Presencial y Digital';
  }

  doc.font('Helvetica').fontSize (12)
  .text ('Modalidad en la que ofrece y comercializa sus servicios: ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (tipo_agencia.toUpperCase ());

  let razon_social: string = item.representante_nombre;
  if (item.representante_tipo === '1') {
    razon_social = item.representante_razon_social;
  }
  doc.font('Helvetica').fontSize (12)
  .text ('Siendo la Razón Social: ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (razon_social.toUpperCase () + ' ', {continued: true, lineGap: 3})
  .font ('Helvetica').fontSize (12)
  .text ('N° de RUC' + ' ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.representante_ruc.toString ().toUpperCase ());

  doc.font('Helvetica').fontSize (12)
  .text ('Domicilio legal: ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (item.representante_direccion.toUpperCase ());

  if (item.representante_departamento === undefined) {
    doc.font('Helvetica').fontSize (12)
    .text ('Región: ' , {continued: true, lineGap: 3})
    .font ('Helvetica-Bold').fontSize (12)
    .text (item.representante_region.toUpperCase (), {continued: true, lineGap: 3})
    .font('Helvetica').fontSize (12)
    .text (', Provincia: ' , {continued: true})
    .font ('Helvetica-Bold').fontSize (12)
    .text (item.representante_provincia.toUpperCase (), {continued: true, lineGap: 3})
    .font('Helvetica').fontSize (12)
    .text (', Distrito: ' , {continued: true, lineGap: 3})
    .font ('Helvetica-Bold').fontSize (12)
    .text (item.representante_distrito.toUpperCase ());
  } else {
    doc.font('Helvetica').fontSize (12)
    .text ('Región/Provincia/Distrito: ', {continued: true, lineGap: 3})
    .font ('Helvetica-Bold').fontSize (12)
    .text (item.representante_departamento.toUpperCase ());
  }

  doc.font('Helvetica').fontSize (12)
  .text ('Fecha de inicio de operaciones: ', {continued: true, lineGap: 3})
  .font ('Helvetica-Bold').fontSize (12)
  .text (moment (item.fecha_ins.substring (0, 10)).format ('DD[/]MM[/]YYYY').toUpperCase ());

  doc.moveDown ();

  doc.font('Helvetica').fontSize (12)
  .text (fecha_aprobado.format ('[Cusco, ]DD[ de ]MMMM[ del ]YYYY'), {align: 'right'});

  if (completo) {
    doc.font('Helvetica').fontSize (9)
    .text ('ESTA CONSTANCIA ES INTRANSFERIBLE Y DEBERÁ FIGURAR EN UNA LUGAR VISIBLE DEL ESTABLECIMIENTO. TODO CAMBIO DEBERÁ SER COMUNICADO A DIRCETUR. ', 72, 800, {align: 'left'});
  }

  return doc;
}

function sendEmail (tipo: string, page: string, page2: string, item: any, nro_certificado: number) {
  qr_code.toDataURL ('https://www.dirceturcusco.gob.pe/' + page + '/' + page2 + '/' + item.id, (err: any, url: any) => {
    let doc: any;

    if (tipo === 'alojamiento') {
      doc = get_pdf_alojamiento (item, nro_certificado, url, true);
    } else if (tipo === 'agencia') {
      if (item.solo_digital === undefined) {
        doc = get_pdf_agencia_fisica (item, nro_certificado, url, true);
      } else {
        doc = get_pdf_agencia_virtual (item, nro_certificado, url, true);
      }
    }

    doc.end ();

    const filePath = path.join(__dirname, '/templates/correo-aprovacion.html');
    fs.readFile (filePath, 'utf-8', (error: any, data: any) => {
      let dataString = data.toString ();
      dataString = dataString.replace('__correo__', item.correo);
      dataString = dataString.replace('__password__', item.password);

      const mailOptions: any = {
        from: 'Dircetur CUSCO <dirceturapp@gmail.com>',
        to: item.correo,
        bcc: 'serviciosturisticos@dirceturcusco.gob.pe',
        subject: 'Tu registro ha sido aprobado',
        html: dataString
      };
  
      mailOptions.attachments = [{
        filename: "certificado.pdf",
        content: doc
      }];
  
      return transporter.sendMail(mailOptions, (_error: any, info: any) => {
          if (error) {
              console.log ('sendMail error', _error);
          } else {
              console.log ('Sended', info);
          }
      });
    });
  });

  return null;
}