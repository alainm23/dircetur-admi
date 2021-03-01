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
  selector: 'ngx-circuito-detalle',
  templateUrl: './circuito-detalle.component.html',
  styleUrls: ['./circuito-detalle.component.scss']
})
export class CircuitoDetalleComponent implements OnInit {
  form: FormGroup;
  id: string;
  idioma: string;
  is_loading: boolean = false;

  is_upload: boolean = false;
  uploadPercent: number = 0;
  imagen_preview: any;
  file: any;
  imagenes: any [] = [];

  dias: any [];
  tags: any [] = [];
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
        id: new FormControl (this.id, [Validators.required])
      });

      this.form.addControl ('nombre_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('descripcion_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('donde_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('altitud_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('incluye_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('no_incluye_' + this.idioma, new FormControl ('', [Validators.required]));

      this.database.getCircuitoById (this.id).subscribe ((d: any) => {
        this.form.patchValue (d);
        this.is_loading = false;

        if (d.imagenes instanceof Array) {
          if (d.imagenes.length > 0) {
            this.imagenes = d.imagenes;
          }
        }

        if (d.tags instanceof Array) {
          if (d.tags.length > 0) {
            this.tags = d.tags;
          }
        }

        console.log (d);
      });

      this.database.getCircuitoDias (this.id).subscribe ((dd) => {
        this.dias = dd,
        console.log (dd);
      });
    });
  }

  agregarDia () {
    let object: any = {};
    object ["id"] = this.database.createId ();
    object ['nombre_' + this.idioma] = "Dia " + (this.dias.length + 1);
    object ["actividades"] = [];

    this.dias.push (object);
  }

  eliminarDia (item: any) {
    for( var i = 0; i < this.dias.length; i++){ 
      if (this.dias[i].id === item.id) {
        this.dias.splice(i, 1); 
      }
    }
  }

  elimninar () {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      this.database.deleteCircuito (this.id)
      .then (() => {
        console.log ("Elininado");
        this.router.navigateByUrl ("pages/circuito-turistico/listar-circuitos");
      })
      .catch (error => {
        console.log ("error", error);
      });
    } else {
      console.log ("Cancelar");
    }
  }

  submit () {
    this.is_loading = true;
    let data: any = this.form.value;
    data.tags = this.tags;

    data.imagenes = this.imagenes;

    if (data.imagenes.length <= 0) {
      data.imagen = "";
    } else {
      data.imagen = data.imagenes [0].url;
    }

    this.database.updateCircuito (data, this.dias)
      .then (() => {
        this.is_loading = false;
        this.showToast ('top-right');
      }).catch ((error: any) => {
        this.is_loading = false;
        console.log ("Error addAgencia", error);
      });
  }

  agregarActividad (d: any) {
    let object: any = {};
    object ["id"] = this.database.createId ();
    object ['nombre_' + this.idioma] = "";
    object ['detalle_' + this.idioma] = "";

    d.actividades.push (object);
  }

  eliminarActividad (a: any, actividades: any []) {
    for( var i = 0; i < actividades.length; i++){ 
      if (actividades [i].id === a.id) {
        actividades.splice(i, 1); 
      }
    }
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'El Circuito se actualizo correctamente',
      { position });
  }

  eliminarImagen (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log ("Ruta:" + "/Circuitos_Turisticos/" + this.id + "/" + item.id);

      this.af_storage.storage.ref ("/Circuitos_Turisticos/" + this.id + "/" + item.id).delete ()
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

    const filePath = '/Circuitos_Turisticos/' + this.id + "/" + id;
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

  agregar_tag (event: any) {
    if (event.target.value != "") {
      this.tags.push ({
        id: this.database.createId (),
        nombre: event.target.value
      });

      event.target.value = "";
    }
  }

  eliminar_tag (item: any) {
    for (var i = 0; i < this.tags.length; i++){
      if (this.tags[i].id === item.id) {
        this.tags.splice(i, 1);
      }
    }
  }
}
