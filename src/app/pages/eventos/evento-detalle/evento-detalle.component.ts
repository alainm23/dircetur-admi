import { Component, OnInit, TemplateRef } from '@angular/core';

import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AngularFireStorage } from '@angular/fire/storage';

import { NbToastrService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';

import { finalize } from 'rxjs/operators';
import { Observable } from "rxjs";
import { NbDialogService } from '@nebular/theme';

import * as moment from 'moment';

@Component({
  selector: 'ngx-evento-detalle',
  templateUrl: './evento-detalle.component.html',
  styleUrls: ['./evento-detalle.component.scss']
})
export class EventoDetalleComponent implements OnInit {
  form: FormGroup;
  id: string;
  idioma: string;
  is_loading: boolean = false;
  
  is_upload: boolean = false;
  uploadPercent: number = 0;
  imagen_preview: any;
  file: any;
  imagenes: any [] = [];
  
  subscribe_01: any;
  subscribe_02: any;
  subscribe_03: any;
  subscribe_04: any;

  esta_distritos_cargando: boolean = true;
  provincias: any [];
  distritos: any [];
  tipos: any [];
  categorias: any [];
  selectedItem: any;

  public Editor = ClassicEditor;
  config: any = {
    fillEmptyBlocks: false,
    tabSpaces: 0
  };

  fecha_antigua: string;

  compareFn = (a: any, b: any) => a.status === b.status;

  constructor(public database: DatabaseService,
              private route: ActivatedRoute,
              private router: Router,
              private dialogService: NbDialogService,
              private af_storage: AngularFireStorage,
              public toastrService: NbToastrService) { }

  async ngOnInit() { 
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.idioma = params ['idioma'];

      console.log (this.id);
      console.log (this.idioma);

      this.form = new FormGroup ({
        id: new FormControl (''),
        fecha: new FormControl ('', [Validators.required]),
        fecha_fin: new FormControl (''),
        organizador: new FormControl ('', [Validators.required]),
        provincia: new FormControl ('', [Validators.required]),
        distrito: new FormControl ('', [Validators.required]),
        tipo: new FormControl ('', [Validators.required])
      });

      this.form.addControl ('titulo_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('detalle_' + this.idioma, new FormControl (''));
      this.form.addControl ('hora_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('direccion_' + this.idioma, new FormControl ('', [Validators.required]));

      this.database.getEventoById (this.id).subscribe ((data: any) => {
        console.log (data);
        this.form.patchValue (data);

        if (data.imagenes instanceof Array) {
          if (data.imagenes.length > 0) {
            this.imagenes = data.imagenes;
          }
        }

        this.form.controls ["fecha"].setValue (new Date (data.fecha).toISOString ().substring (0, 10));
        this.fecha_antigua = data.fecha;

        this.is_loading = false;

        this.subscribe_01 = this.database.getProvincias ().subscribe ((response: any []) => {
          this.provincias = response;
          this.provinciaChanged (data.provincia);
        });

        this.subscribe_03 = this.database.getEventosTipos ().subscribe ((r) => {
          this.tipos = r;
        });
      });
    });
  }

  ngOnDestroy () {
    if (this.subscribe_01 !== null && this.subscribe_01 !== undefined) {
      this.subscribe_01.unsubscribe ();
    }

    if (this.subscribe_02 !== null && this.subscribe_02 !== undefined) {
      this.subscribe_02.unsubscribe ();
    }
  }

  elimninar () {
    var opcion = confirm("¿Eliminar?");
    if (opcion == true) {
      this.database.deleteEvento (this.form.value)
      .then (() => {
        console.log ("Elininado");
        this.router.navigate(['/pages/eventos/ver-eventos']);
      })
      .catch (error => {
        console.log ("error", error);
      });
    } else {
      console.log ("Cancelar");
    }
  }

  provinciaChanged (event: any) {
    this.esta_distritos_cargando = true;
    console.log (event);
    this.subscribe_02 = this.database.getDistritosByProvincias (event.id).subscribe ((response: any []) => {
      this.distritos = response;
      this.esta_distritos_cargando = false;

      this.form.controls ["distrito"].setValue (this.form.value.distrito);
    }, (error: any) => {
      console.log ('getDistritosByProvincias', error);
      this.esta_distritos_cargando = true;
    });
  }

  submit () {
    console.log (this.form.value);

    let data: any = this.form.value;

    if (data.fecha_fin !== '') {
      data.fecha_fin = new Date(data.fecha_fin).toISOString ();
    }
    data.fecha = new Date(data.fecha).toISOString ();

    data.imagenes = this.imagenes;
    if (this.imagenes.length > 0) {
      data.imagen = this.imagenes [0].url;
    }

    this.is_loading = true;

    console.log ("data", data);
    console.log ("fecha_antigua", this.fecha_antigua);

    this.database.updateEvento (data, this.fecha_antigua)
      .then (() => {
        this.is_loading = false;
        this.showToast ('top-right');
        this.uploadPercent = 0;
      }).catch ((error: any) => {
        this.is_loading = false;
        console.log ("Error updateEvento", error);
      });
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'El evento: se actualizo correctamente',
      { position });
  }

  eliminarImagen (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log ("Ruta:" + "/Eventos/" + this.id + "/" + item.id);

      this.af_storage.storage.ref ("/Eventos/" + this.id + "/" + item.id).delete ()
        .then (() => {
          console.log ("se elimino");
          for( var i = 0; i < this.imagenes.length; i++) { 
            if ( this.imagenes[i].id === item.id) {
              this.imagenes.splice (i, 1); 
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

    const filePath = '/Eventos/' + this.id + "/" + id;
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

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
  }
}
