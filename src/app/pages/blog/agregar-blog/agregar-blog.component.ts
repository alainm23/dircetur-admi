import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';

import { DatabaseService } from '../../../services/database.service';
import { NbToastrService } from '@nebular/theme';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';
import { Observable } from "rxjs";

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'ngx-agregar-blog',
  templateUrl: './agregar-blog.component.html',
  styleUrls: ['./agregar-blog.component.scss'] 
})
export class AgregarBlogComponent implements OnInit {
  form: FormGroup;
  is_loading: boolean = false;

  files: any [] = [];
  imagenes: any [] = [];
  subidos: number = 0;

  categorias: any [];

  public Editor = ClassicEditor;
  
  config: any = {
    fillEmptyBlocks: false,
    tabSpaces: 0
  };  
  constructor(public database: DatabaseService,
              private af_storage: AngularFireStorage,
              public toastrService: NbToastrService) {
  }

  ngOnInit() {
    this.form = new FormGroup ({
      imagenes: new FormControl ([]),
      imagen: new FormControl (''), 
      titulo_es: new FormControl ('', [Validators.required]),
      detalle_es: new FormControl ('', [Validators.required]),
      autor: new FormControl ('', [Validators.required]),
      resumen_es: new FormControl ('', [Validators.required]),
      categoria: new FormControl ('', [Validators.required])
    });

    this.database.getBlog_Categorias ().subscribe ((response: any []) => {
      this.categorias = response.reverse ();
      this.is_loading = false;
    });
  }

  submit () {
    console.log (this.form.value);

    let data: any = this.form.value;
    
    data.id = this.database.createId ();
    data.fecha_creado = new Date().toISOString ();
    
    this.is_loading = true;

    console.log (data);

    if (this.files.length > 0) {
      for (var i = 0; i < this.files.length; i++) {
        console.log ('Imagen data', this.files [i]);
        this.uploadImageAsPromise(this.files [i], data);
      }
    } else {
      this.database.addBlog (data)
        .then (() => {
          this.is_loading = false;
          this.showToast ('top-right');
          
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
      'El blog: se agrego correctamente',
      { position });
  }

  uploadImageAsPromise (file: any, data: any) {
    const filePath = 'Blogs/' + data.id + "/" + file.id;
    const fileRef = this.af_storage.ref (filePath);
    const task = this.af_storage.upload (filePath, file.file);

    task.percentageChanges ().subscribe ((res: any) => {
      file.uploadPercent = res;
    });

    task.snapshotChanges ().pipe (
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
          data.imagen = this.imagenes [0].url;
          this.database.addBlog (data)
            .then (() => {
              this.is_loading = false;
              this.showToast ('top-right');

              this.form.reset ();
              this.files = [];
              this.imagenes = [];
              this.subidos = 0;
            }).catch ((error: any) => {
              this.is_loading = false;
              console.log ("Error addBlog", error);
            });
        }
      })
    )
    .subscribe ();
  }
  
  changeListener (event: any) {
    if (event.target.files.length > 0) {
      for (let index = 0; index < event.target.files.length; index++) {
        let file = {
          id: this.database.createId (),
          file: event.target.files [index],
          image: '',
          uploadPercent: 0
        };
    
        this.files.push (file);
        this.getBase64 (file);
      }
    }
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
    for( var i = 0; i < this.files.length; i++) { 
      if ( this.files[i].id === item.id) {
        this.files.splice(i, 1); 
      }
    }
  }

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
  }
}
