import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { NbToastrService, NbStepperComponent } from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore'; 
import * as moment from 'moment';
@Component({
  selector: 'ngx-registrar-solicitudv2',
  templateUrl: './registrar-solicitudv2.component.html',
  styleUrls: ['./registrar-solicitudv2.component.scss']
})
export class RegistrarSolicitudv2Component implements OnInit {

@ViewChild('stepper', {static: false}) stepperComponent: NbStepperComponent;
form: FormGroup;
form2: FormGroup;
selectedItemTipo: string ='Juridica';
form3: FormGroup;
form4: FormGroup;
form5: FormGroup;
capacitaciones: any [];
asuntos: any [];
subscribe_01: any;
subscribe_02: any;
subscribe_03: any;
subscribe_04: any;
subscribe_05: any;
subscribe_06: any;
subscribe_07: any;
no_existe_solicitante: boolean = false;
existe_solicitante: boolean = false;
validar_solicitante: boolean = true;
estado_natural: boolean = false;
estado_juridico: boolean = false;
estado_select_capacitacion: boolean = false;
primer_step: number = 0;
segundo_step: number = 0;
segundo_step_disponible: boolean = false;
ultimo_step_disponible: boolean = false;
finalizar_step_natural_disponible: boolean = false;
esta_distritos_cargando: boolean = true;
estado_form4: boolean = false;
linearMode: boolean = false;
info_solicitante: any;
provincias: any [];
distritos: any [];
id_solicitante: string;
id_solicitud: string;
mensaje_principal: string;
mensaje_secundario: string;
mensaje_nombre: string;
item_seleccionado: any;

descripcion: any;
/*pos_num_capacitacion: number;
pos: number;*/
  constructor(public database: DatabaseService,
              public toastrService: NbToastrService,
              public authService: AuthService,
              private afs: AngularFirestore,
              private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup ({
      n_doc: new FormControl ('', [Validators.required, Validators.minLength(8), Validators.maxLength(11)])
    });
    this.subscribe_01 = this.database.getProvincias ().subscribe ((response: any []) => {
      this.provincias = response;
    });
    console.log('El usuario logeado es:',this.authService.usuario);
  }

  nextStep() { this.stepperComponent.next(); }

//  previousStep() { this.stepperComponent.previous(); }

/* Funcion para validar si existe el solicitante */
  submitValidar () {

    this.subscribe_03 = this.database.getSolicitanteById (String(this.form.value.n_doc)).subscribe ((response: any []) => {
      if(response==null || response==undefined)
      {
        this.validar_solicitante=false;
        this.no_existe_solicitante=true;
        this.existe_solicitante=false;
        this.estado_form4=false;
        this.estado_juridico=true;
        console.log('No Existe');
        this.form2 = new FormGroup ({
          tipo: new FormControl ('Juridica', [Validators.required]),
          nombre_completo: new FormControl (''),
          n_doc: new FormControl ('', [Validators.required]),
          razon_social: new FormControl (''),
          nombre_comercial: new FormControl (''),
          correo: new FormControl ('', [Validators.required, Validators.email]),
          telefono: new FormControl ('', [Validators.required]),
          provincia: new FormControl ('', Validators.required),
          distrito: new FormControl ('', Validators.required),
          direccion_completa: new FormControl ('', Validators.required)
        });
        this.form2.controls['n_doc'].setValue(this.form.value.n_doc);
        this.id_solicitante = String(this.form2.value.n_doc);
      }
      else
      {
        this.primer_step=1;
        this.validar_solicitante=false;
        this.existe_solicitante=true;
        this.no_existe_solicitante=false;
        this.estado_form4=true;
        this.info_solicitante=response;
        console.log('Existe');
        this.form3 = new FormGroup ({
          tipo: new FormControl ('', [Validators.required]),
          nombre_completo: new FormControl (''),
          n_doc: new FormControl ('', [Validators.required]),
          razon_social: new FormControl (''),
          nombre_comercial: new FormControl (''),
          correo: new FormControl ('', [Validators.required, Validators.email]),
          telefono: new FormControl ('', [Validators.required]),
          provincia: new FormControl ('', Validators.required),
          distrito: new FormControl ('', Validators.required),
          direccion_completa: new FormControl ('', Validators.required)
        });
          if(this.info_solicitante.tipo=="Natural")
          {
            this.estado_juridico=false;
            this.estado_natural=true;
            this.ultimo_step_disponible=false;
            this.finalizar_step_natural_disponible=true;
          }
          else
          {
            this.estado_natural=false;
            this.estado_juridico=true;
            this.ultimo_step_disponible=true;
            this.finalizar_step_natural_disponible=false;
            /* creamos el form5 */
            this.form5 = new FormGroup ({
              nombre_completo_contacto: new FormControl ('', [Validators.required]),
              correo_contacto: new FormControl ('', [Validators.required]),
              telefono_contacto: new FormControl ('', [Validators.required]),
              dni_contacto: new FormControl ('', [Validators.required])
            });
          }
          this.id_solicitante = this.info_solicitante.n_doc;
          console.log('Este es el id del solicitante=',this.id_solicitante);
          this.subscribe_04 = this.database.getSolicitanteById (this.id_solicitante).subscribe ((d: any) => {
            console.log('objeto',d);
            this.form3.patchValue (d);
            this.subscribe_01 = this.database.getProvincias ().subscribe ((response: any []) => {
              this.provincias = response;
    
              this.provinciaChanged (d.provincia);
            });
          });
          this.habilitarSolicitud ();
          this.nextStep ();

      }
    });
    
  }

  provinciaChanged (event: any) {
    this.esta_distritos_cargando = true;
    console.log (event);
    this.subscribe_02 = this.database.getDistritosByProvincias (event.id).subscribe ((response: any []) => {
      this.distritos = response;
      this.esta_distritos_cargando = false;
    }, (error: any) => {
      console.log ('getDistritosByProvincias', error);
      this.esta_distritos_cargando = true;
    });
  }
  
  /* Funcion para editar el solicitante */
  editarBeneficiario (item: any) {
    this.item_seleccionado = item;
    console.log('este es el id=',this.item_seleccionado.n_doc);
    this.router.navigate(['/pages/solicitudes/solicitante-detalle/',this.item_seleccionado.n_doc]);
  }

  /* Funcion para agregar el solicitante */
  submitadd () {
    this.estado_form4=true;
    this.primer_step=1;
    let obj: any;
    if (this.form2.value.tipo=='Juridica')
    {
        obj = {
        tipo:this.form2.value.tipo,
        n_doc:String(this.form2.value.n_doc),
        razon_social:this.form2.value.razon_social,
        nombre_comercial:this.form2.value.nombre_comercial,
        correo:this.form2.value.correo,
        telefono:this.form2.value.telefono,
        provincia:this.form2.value.provincia,
        distrito:this.form2.value.distrito,
        direccion_completa:this.form2.value.direccion_completa,
        agregado_por:this.authService.usuario.nombre,
        date_added: new Date ().toISOString ()
      };
    }
    else
    {
        obj = {
        tipo:this.form2.value.tipo,
        nombre_completo:this.form2.value.nombre_completo,
        n_doc:String(this.form2.value.n_doc),
        correo:this.form2.value.correo,
        telefono:this.form2.value.telefono,
        provincia:this.form2.value.provincia,
        distrito:this.form2.value.distrito,
        direccion_completa:this.form2.value.direccion_completa,
        agregado_por:this.authService.usuario.nombre,
        date_added: new Date ().toISOString ()
      };
    }

    this.database.addSolicitante(obj);
    this.mensaje_principal="El Solicitante: ";
    this.mensaje_nombre=this.form2.value.nombre_completo;
    this.mensaje_secundario=" se agrego correctamente.";
    this.showToast ('top-right');
    this.form2.reset ();
    this.info_solicitante=obj;
    //this.nextStep ();
    this.habilitarSolicitud ();
  }
  
 /* Funcion para habilitar el select de capacitaciones */
  saberCap () {
    let asunto: any = this.form4.value.asunto;
    console.log ('Este es el asunto seleccionado=',asunto);
    if (asunto.nombre=="capacitación" || asunto.nombre=="Capacitación" || asunto.nombre=="capacitacion" || asunto.nombre=="Capacitacion" || asunto.nombre=="CAPACITACION")
    {
      this.estado_select_capacitacion=true;
    }
    else 
    {
      this.estado_select_capacitacion=false;
    }
  }

  /* Funcion para Crear la solicitud */
  submitaddSolicitud (tipo: number) {
    if (tipo==1)
    {
      // Natural

      let objAsunto: any = {
        id:this.form4.value.asunto.id,
        nombre:this.form4.value.asunto.nombre
      }
      let objCapacitacion: any ;
      let objSolicitud: any ;
      if (this.estado_select_capacitacion==true)
      {
        objCapacitacion = {
          id:this.form4.value.capacitacion.id,
          nombre:this.form4.value.capacitacion.nombre
        }
        objSolicitud = {
          id:this.afs.createId (),
          id_solicitante:this.id_solicitante,
          tipo:this.form4.value.tipo,
          nombre_completo:this.form4.value.nombre_completo,
          n_doc:this.form4.value.n_doc,
          provincia:this.form4.value.provincia,
          distrito:this.form4.value.distrito,
          agregado_por:this.authService.usuario.nombre,
          capacitacion:objCapacitacion,
          asunto:objAsunto,
          estado:0,
          ano: moment().format('YYYY'),
          mes: moment().format('MM'),
          fecha_solicitud: new Date ().toISOString ()
        };
      }
      else
      {
        objSolicitud = {
          id:this.afs.createId (),
          id_solicitante:this.id_solicitante,
          tipo:this.form4.value.tipo,
          nombre_completo:this.form4.value.nombre_completo,
          n_doc:this.form4.value.n_doc,
          provincia:this.form4.value.provincia,
          distrito:this.form4.value.distrito,
          agregado_por:this.authService.usuario.nombre,
          asunto:objAsunto,
          estado:0,
          ano: moment().format('YYYY'),
          mes: moment().format('MM'),
          fecha_solicitud: new Date ().toISOString ()
        };
      }

      this.descripcion=this.form4.value.descripcion, 
      this.id_solicitud=objSolicitud.id;
      this.database.addSolicitud(objSolicitud).then (()=>{
        // Exito
        this.segundo_step=1;
        this.segundo_step_disponible=false;
        this.nextStep ();
        /* Como es natural creamos la collecion de Detalle */
        let objDetalle: any = {
          descripcion:this.descripcion
        };
        this.database.addDetalleContacto(this.id_solicitud, objDetalle).then (()=>{
          this.mensaje_principal="La Solicitud del Beneficiario: ";
          this.mensaje_nombre=this.form4.value.nombre_completo;
          this.mensaje_secundario=" se creo correctamente.";
          this.showToast ('top-right');
          this.form4.reset ();
        }).catch((e)=> {
          console.log('error al crear el detalle de la solicitud',e);
        });
      }).catch((e)=> {
        console.log('error al crear la solicitud natural',e);
      });
    }
    else
    {
      // Juridica
      let objAsunto: any = {
        id:this.form4.value.asunto.id,
        nombre:this.form4.value.asunto.nombre
      }
      let objCapacitacion: any ;
      let objSolicitud: any ;
      if (this.estado_select_capacitacion==true)
      {
        objCapacitacion = {
          id:this.form4.value.capacitacion.id,
          nombre:this.form4.value.capacitacion.nombre
        }
        objSolicitud = {
          id:this.afs.createId (),
          id_solicitante:this.id_solicitante,
          tipo:this.form4.value.tipo,
          n_doc:this.form4.value.n_doc,
          nombre_comercial:this.form4.value.nombre_comercial,
          provincia:this.form4.value.provincia,
          distrito:this.form4.value.distrito,
          agregado_por:this.authService.usuario.nombre,
          capacitacion:objCapacitacion,
          asunto:objAsunto,
          estado:0,
          ano: moment().format('YYYY'),
          mes: moment().format('MM'),
          fecha_solicitud: new Date ().toISOString ()
        };
      }
      else
      {
        objSolicitud = {
          id:this.afs.createId (),
          id_solicitante:this.id_solicitante,
          tipo:this.form4.value.tipo,
          n_doc:this.form4.value.n_doc,
          nombre_comercial:this.form4.value.nombre_comercial,
          provincia:this.form4.value.provincia,
          distrito:this.form4.value.distrito,
          agregado_por:this.authService.usuario.nombre,
          asunto:objAsunto,
          estado:0,
          ano: moment().format('YYYY'),
          mes: moment().format('MM'),
          fecha_solicitud: new Date ().toISOString ()
        };
      }
      
      this.descripcion=this.form4.value.descripcion, 
      this.id_solicitud=objSolicitud.id;

      this.database.addSolicitud(objSolicitud).then (()=>{
        // Exito
        this.segundo_step=1;
        this.segundo_step_disponible=false;
        this.mensaje_principal="La Solicitud del Beneficiario: ";
        this.mensaje_nombre=this.form4.value.nombre_completo;
        this.mensaje_secundario=" se creo correctamente.";
        this.showToast ('top-right');
        this.form4.reset ();
        this.nextStep ();
        this.submitaddContacto ();
      }).catch((e)=> {
        console.log('error al crear la solicitud juridica',e);
      });

    }
    
  }

  /* Funcion para Add Detalle Contacto */
  submitaddContacto () {
    let objContacto: any = {
      nombre_completo_contacto:this.form5.value.nombre_completo_contacto,
      correo_contacto:this.form5.value.correo_contacto,
      telefono_contacto:this.form5.value.telefono_contacto,
      dni_contacto:this.form5.value.dni_contacto,
      descripcion:this.descripcion
    };
    this.database.addDetalleContacto(this.id_solicitud, objContacto).then (()=>{
      // Exito
      this.form5.reset ();
    }).catch((e)=> {
      console.log('error al crear el detalle en la solicitud',e);
    });
    
  }

  showToast (position) {
    this.toastrService.show(
      '',
      this.mensaje_principal + this.mensaje_nombre + this.mensaje_secundario,
      { position });
  }

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
  }

  /* Funcion para habilitar el form de solicitud */
  habilitarSolicitud () {
    
    if (this.estado_form4==true)
      {
        console.log('Creamos el formulario de Solicitud y este es el id del solicitante=',this.id_solicitante);
        /* Creamos el formulario de Solicitud */
        this.form4 = new FormGroup ({
          tipo: new FormControl (''),
          nombre_completo: new FormControl (''),
          n_doc: new FormControl ('', [Validators.required]),
          nombre_comercial: new FormControl (''),
          provincia: new FormControl ('', Validators.required),
          distrito: new FormControl ('', Validators.required),
          asunto: new FormControl ('', Validators.required),
          capacitacion: new FormControl (''),
          descripcion: new FormControl ('', Validators.required)
        });

        this.subscribe_05 = this.database.getSolicitanteById (this.id_solicitante).subscribe ((d: any) => {
          this.form4.patchValue (d);
          this.subscribe_06 = this.database.getCapacitaciones ().subscribe ((response: any []) => {
            this.capacitaciones = response;
          });
          this.subscribe_07 = this.database.getAsuntos ().subscribe ((response: any []) => {
            this.asuntos = response;
          });
        });

        this.segundo_step_disponible=true;

        /* end Solicitud Init */
      }
  }

  /* Funcion para reset y volver al input de Dni */
  formValidarDni () {
    this.no_existe_solicitante = false;
    this.existe_solicitante = false;
    this.validar_solicitante = true;
    this.segundo_step_disponible = false;
    this.form.reset();
    this.form2.reset();
    this.form3.reset();
    this.form4.reset();
    this.form5.reset();
  }

  /* Funcion para saber que input solicitar al Beneficiario */
  tipoPersona (tipo:string) {
    if(tipo=="natural")
    {
      this.estado_juridico=false;
      this.estado_natural=true;
    }
    else
    {
      this.estado_natural=false;
      this.estado_juridico=true;
    }
  }

  /* Funcion para redirigir a una pagina de FIN */
  finalizarSolicitud () {
    console.log('Finalizo su registro completo con éxito');
    this.mensaje_principal="Finalizo su ";
    this.mensaje_nombre="registro completo ";
    this.mensaje_secundario="con éxito.";
    this.showToast ('top-right');
    this.router.navigate(['/pages/solicitudes/procesar-solicitudes']);
  }
  /* Funcion para reset y volver al input de Dni */
  irAddSolicitud () {
  /* window.location.reload(); */

  this.no_existe_solicitante = false;
  this.existe_solicitante = false;
  this.validar_solicitante = true;
  this.estado_natural = false;
  this.estado_juridico = false;
  this.estado_select_capacitacion = false;
  this.segundo_step_disponible = false;
  this.ultimo_step_disponible = false;
  this.finalizar_step_natural_disponible = false;
  this.esta_distritos_cargando = true;
  this.estado_form4 = false;
  this.stepperComponent.reset ();
  this.form.reset();
  this.form2.reset();
  this.form3.reset();
  this.form4.reset();
  this.form5.reset();
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

    if (this.subscribe_06 !== null && this.subscribe_06 !== undefined) {
      this.subscribe_06.unsubscribe ();
    }

    if (this.subscribe_07 !== null && this.subscribe_07 !== undefined) {
      this.subscribe_07.unsubscribe ();
    }
  }

}
