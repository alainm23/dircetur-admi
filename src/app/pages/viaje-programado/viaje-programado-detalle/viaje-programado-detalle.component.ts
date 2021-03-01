import { Component, OnInit, TemplateRef } from '@angular/core';

import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

import { NbToastrService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';

import { finalize } from 'rxjs/operators';
import { Observable } from "rxjs";
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-viaje-programado-detalle',
  templateUrl: './viaje-programado-detalle.component.html',
  styleUrls: ['./viaje-programado-detalle.component.scss']
})
export class ViajeProgramadoDetalleComponent implements OnInit {
  form: FormGroup;
  is_loading: boolean = false;
  id: string;

  is_upload: boolean = false;
  uploadPercent: number = 0;
  imagen_preview: any;
  file: any;
  imagenes: any [] = [];

  preguntas: any [] = [];
  constructor(public database: DatabaseService,
              private route: ActivatedRoute,
              private router: Router,
              private dialogService: NbDialogService,
              private af_storage: AngularFireStorage,
              public toastrService: NbToastrService) { }

  ngOnInit() {
    this.form = new FormGroup ({
      id: new FormControl (''),
      nombre: new FormControl ('', [Validators.required]),
      descripcion: new FormControl ('', [Validators.required]),
      donde: new FormControl ('', [Validators.required]),
      altitud: new FormControl ('', [Validators.required]),
      tags: new FormControl (''),
      incluye: new FormControl ('', [Validators.required]),
      no_incluye: new FormControl ('', [Validators.required]),
      prpoteccion_turista: new FormControl ('', [Validators.required]),
      dificultad_ruta: new FormControl ('', [Validators.required]),
      restricciones_requisitos: new FormControl ('', [Validators.required]),
      importante: new FormControl ('', [Validators.required]),
      itinerario: new FormControl ('', [Validators.required]),
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];

      this.database.getViajesProgramadoById (this.id).subscribe ((d: any) => {
        this.form.patchValue (d);
        this.is_loading = false;

        this.imagenes = d.imagenes;

        this.preguntas = d.preguntas;
      });
    });
  }

  agregarPregunta () {
    this.preguntas.push ({
      _id:  Math.random(),
      pregunta: '',
      respuesta: ''
    });
  }

  eliminarPregunta (item: any) {
    for( var i = 0; i < this.preguntas.length; i++){ 
      if ( this.preguntas[i]._id === item._id) {
        this.preguntas.splice(i, 1); 
      }
    }
  }

  submit () {
    this.is_loading = true;

    let data: any = this.form.value;
    data.preguntas = this.preguntas;
    data.imagenes = this.imagenes;
    console.log (data);

    this.preguntas.forEach ((d) => {
      console.log (d);
    });

    this.database.updateViajeProgramado (data)
      .then (() => {
        this.is_loading = false;;
        this.showToast ('top-right');
      }).catch ((error: any) => {
        this.is_loading = false;
        console.log ("Error addAgencia", error);
      });
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'El viaje programado: ' + this.form.value.nombre + ' se actualizo correctamente',
      { position });
  }

  eliminarImagen (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log ("Ruta:" + "/Viajes_Programados/" + this.id + "/" + item.id);

      this.af_storage.storage.ref ("/Viajes_Programados/" + this.id + "/" + item.id).delete ()
        .then (() => {
          console.log ("se elimino");
          for( var i = 0; i < this.imagenes.length; i++) {
            if ( this.imagenes[i].id === item.id) {
              this.imagenes.splice(i, 1); 
            }
          }

          this.submit ();
        })
        .catch (error => {
          console.log ("error", error);
        });
    } else {
      console.log ("Cancelar");
    }
  }
  
  changeListener (event: any, dialog: TemplateRef<any>) {
    this.file = event.target.files [0];
    this.getBase64 (this.file);
    this.open (dialog);
  }

  subir (dialog: any) {
    this.is_upload = true;

    let id = this.database.createId ();

    const filePath = '/Viajes_Programados/' + this.id + "/" + id;
    const fileRef = this.af_storage.ref (filePath);
    const task = this.af_storage.upload (filePath, this.file);

    task.percentageChanges().subscribe ((res: any) => {
      this.uploadPercent = res;
    });

    task.snapshotChanges().pipe(
      finalize(async () => {
        let downloadURL = await fileRef.getDownloadURL ().toPromise();
        console.log ("downloadURL", downloadURL);

        let image: any = {
          id: id,
          url: downloadURL
        }

        dialog.close ();
        this.is_upload = false;
        this.imagenes.push (image);
        this.submit ();
      })
    )
    .subscribe ();
  }
  
  open (dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  getBase64(file: any) {
    var reader = new FileReader ();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      this.imagen_preview = reader.result;
    };
    
    reader.onerror = (error) => {

    };
  }
}
