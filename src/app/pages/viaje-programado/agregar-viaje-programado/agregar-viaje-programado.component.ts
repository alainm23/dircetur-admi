import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';

import { DatabaseService } from '../../../services/database.service';
import { NbToastrService } from '@nebular/theme';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';
import { Observable } from "rxjs";

@Component({
  selector: 'ngx-agregar-viaje-programado',
  templateUrl: './agregar-viaje-programado.component.html',
  styleUrls: ['./agregar-viaje-programado.component.scss']
})
export class AgregarViajeProgramadoComponent implements OnInit {
  form: FormGroup;
  is_loading: boolean = false;

  files: any [] = [];
  imagenes: any [] = [];
  subidos: number = 0;

  preguntas: any [] = [];
  tipos: any [] = [];
  constructor(private toastrService: NbToastrService,
              private af_storage: AngularFireStorage,
              private database: DatabaseService) { }

  ngOnInit() {
    this.form = new FormGroup ({
      imagenes: new FormControl (''),
      imagen: new FormControl (''),
      nombre: new FormControl ('', [Validators.required]),
      tipo: new FormControl ('', [Validators.required]),
      resumen: new FormControl ('', [Validators.required]),
      descripcion: new FormControl ('', [Validators.required]),
      donde: new FormControl ('', [Validators.required]),
      altitud: new FormControl ('', [Validators.required]),
      tags: new FormControl (''),
      incluye: new FormControl ('', [Validators.required]),
      no_incluye: new FormControl ('', [Validators.required]),
      proteccion_turista: new FormControl ('', [Validators.required]),
      dificultad_ruta: new FormControl ('', [Validators.required]),
      restricciones_requisitos: new FormControl ('', [Validators.required]),
      importante: new FormControl ('', [Validators.required]),
      preguntas: new FormControl (''),
      itinerario: new FormControl ('', [Validators.required]),
      nro_salidas: new FormControl (0),
      estado: new FormControl (2)
    });
    
    this.agregarPregunta ();

    this.database.getViajesProgramadosTipos ().subscribe ((res: any[]) => {
      this.tipos = res;
    });
  }

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
  }

  agregarPregunta () {
    this.preguntas.push ({
      id: this.database.createId (),
      pregunta: '',
      respuesta: ''
    });
  }

  eliminarPregunta (item: any) {
    for (var i = 0; i < this.preguntas.length; i++){ 
      if (this.preguntas[i].id === item.id) {
        this.preguntas.splice(i, 1); 
      }
    }
  }

  submit () {
    this.is_loading = true;

    let data: any = this.form.value;
    data.id = this.database.createId ();
    
    data.fecha_creado = new Date().toISOString ();
    data.preguntas = this.preguntas;


    if (this.files.length > 0) {
      for (var i = 0; i < this.files.length; i++) {
        console.log ('Imagen data', this.files [i]);
        this.uploadImageAsPromise(this.files [i], data);
      }
    } else {
      this.database.addViajeProgramado (data)
        .then (() => {
          this.is_loading = false;;
          this.showToast ('top-right');

          this.preguntas = [];
          this.agregarPregunta ();
          
          this.form.reset ();
        }).catch ((error: any) => {
          this.is_loading = false;
          console.log ("Error addAgencia", error);
        });
    }
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'El viaje programado: ' + this.form.value.nombre + ' se agrego correctamente',
      { position });
  }

  uploadImageAsPromise (file: any, data: any) {
    const filePath = 'Viajes_Programados/' + data.id + "/" + file.id;
    const fileRef = this.af_storage.ref (filePath);
    const task = this.af_storage.upload (filePath, file.file);

    task.percentageChanges().subscribe ((res: any) => {
      file.uploadPercent = res;
    });

    task.snapshotChanges().pipe(
      finalize(async () => {
        let downloadURL = await fileRef.getDownloadURL ().toPromise();
        console.log ("downloadURL", downloadURL);

        this.subidos++;
        this.imagenes.push ({
          id: file.id,
          url: downloadURL
        });

        if (this.subidos === this.files.length) {
          data.imagenes = this.imagenes;
          data.imagen = this.imagenes [0];

          this.database.addViajeProgramado (data)
            .then (() => {
              this.is_loading = false;;
              this.showToast ('top-right');

              this.preguntas = [];
              this.agregarPregunta ();
              this.files = [];
              this.imagenes = [];
              this.subidos = 0;
              
              this.form.reset ();
            }).catch ((error: any) => {
              this.is_loading = false;
              console.log ("Error addAgencia", error);
            });
        }
      })
    )
    .subscribe ();
  }
  
  changeListener (event: any) {
    let file = {
      id: this.database.createId (),
      file: event.target.files[0],
      image: '',
      uploadPercent: 0
    };

    this.files.push (file);
    this.getBase64 (file);
  }

  getBase64(file: any) {
    var reader = new FileReader ();
    reader.readAsDataURL(file.file);
    
    reader.onload = () => {
      file.image = reader.result;
    };
    
    reader.onerror = (error) => {

    };
  }

  eliminarImagen (item: any) {
    for (var i = 0; i < this.files.length; i++) { 
      if (this.files[i].id === item.id) {
        this.files.splice(i, 1); 
      }
    }
  }
}
