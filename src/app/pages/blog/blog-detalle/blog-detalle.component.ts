import { Component, OnInit, TemplateRef } from '@angular/core';

import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { NbToastrService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';

import { finalize } from 'rxjs/operators';
import { Observable } from "rxjs";
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-blog-detalle',
  templateUrl: './blog-detalle.component.html',
  styleUrls: ['./blog-detalle.component.scss']
})
export class BlogDetalleComponent implements OnInit {
  form: FormGroup;
  id: string;
  idioma: string;
  is_loading: boolean = false;

  public Editor = ClassicEditor;
  config: any = {
    fillEmptyBlocks: false,
    tabSpaces: 0
  };

  is_upload: boolean = false;
  uploadPercent: number = 0;
  imagen_preview: any;
  file: any;
  imagenes: any [] = [];

  categorias: any [];
  categoria_old: any;
  constructor(public database: DatabaseService,
              private route: ActivatedRoute,
              private router: Router,
              private dialogService: NbDialogService,
              private af_storage: AngularFireStorage,
              public toastrService: NbToastrService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.idioma = params ['idioma'];

      this.form = new FormGroup ({
        id: new FormControl (''),
        imagen: new FormControl (''),
        autor: new FormControl ('', [Validators.required]),
        categoria: new FormControl ('', [Validators.required])
      });

      this.form.addControl ('titulo_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('detalle_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('resumen_' + this.idioma, new FormControl ('', [Validators.required]));

      console.log (this.idioma);

      this.database.getBlogById (this.id).subscribe ((d: any) => {
        this.form.patchValue (d);
        this.is_loading = false;

        if (d.imagenes.length > 0) {
          this.imagenes = d.imagenes;
        }
        
        this.categoria_old = d.categoria;

        this.database.getBlog_Categorias ().subscribe ((response: any []) => {
          this.categorias = response.reverse ();
          this.is_loading = false;
        });
      });
    });
  }

  elimninar () {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      this.database.deleteBlog (this.form.value)
      .then (() => {
        console.log ("Elininado");
        this.router.navigateByUrl ("/pages/blog/ver-blog");
      })
      .catch (error => {
        console.log ("error", error);
      });
    } else {
      console.log ("Cancelar");
    }
  }

  eliminarImagen (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log ("Ruta:" + "/Blogs/" + this.id + "/" + item.id);

      this.af_storage.storage.ref ("/Blogs/" + this.id + "/" + item.id).delete ()
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

    const filePath = '/Blogs/' + this.id + "/" + id;
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
  
  submit () {
    this.is_loading = true;
    let data: any = this.form.value;

    data.imagenes = this.imagenes;
    if (this.imagenes.length > 0) {
      data.imagen = this.imagenes [0].url;
    }
    
    this.database.updateBlog (data, this.categoria_old)
      .then (() => {
        this.is_loading = false;
        this.showToast ('top-right');
        this.uploadPercent = 0;
      }).catch ((error: any) => {
        this.is_loading = false;
        console.log ("Error addAgencia", error);
      });
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'El evento se actualizo correctamente',
      { position });
  }

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
  }
}
