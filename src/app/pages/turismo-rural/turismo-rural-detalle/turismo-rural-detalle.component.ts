import { Component, OnInit, TemplateRef} from '@angular/core';

import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

import { NbToastrService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';

import { finalize } from 'rxjs/operators';
import { Observable } from "rxjs";
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-turismo-rural-detalle',
  templateUrl: './turismo-rural-detalle.component.html',
  styleUrls: ['./turismo-rural-detalle.component.scss']
})
export class TurismoRuralDetalleComponent implements OnInit {
  form: FormGroup;
  idioma: string;
  is_loading: boolean = false;

  is_upload: boolean = false;
  uploadPercent: number = 0;
  imagen_preview: any;
  file: any;
  imagenes: any [] = [];

  id: string;
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
        id: new FormControl (this.id, [Validators.required]),
        telefono: new FormControl ('', [Validators.required]),
        email: new FormControl ('', [Validators.required]),
        pagina_web: new FormControl ('', [Validators.required])
      });
      
      this.form.addControl ('nombre_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('descripcion_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('donde_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('altitud_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('incluye_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('distancia_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('informes_reserva_' + this.idioma, new FormControl ('', [Validators.required]));
      this.form.addControl ('itinerario_' + this.idioma, new FormControl ('', [Validators.required]));

      this.database.getTurismoRuralById (this.id).subscribe ((d: any) => {
        this.form.patchValue (d);
        this.is_loading = false;

        if (d.imagenes instanceof Array) {
          if (d.imagenes.length > 0) {
            this.imagenes = d.imagenes;
          }
        }
      });
    });
  }

  submit () {
    console.log (this.form);

    let data = this.form.value;
    this.is_loading = true;

    data.imagenes = this.imagenes;

    this.database.updateTurismoRural (data)
      .then ((res) => {
        this.is_loading = false;
        this.showToast ('top-right');
      })
      .catch (error => {
        this.is_loading = false;
        console.log ("Error addAgencia", error);
      });
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'Se actualizo correctamente',
      { position });
  }

  eliminarImagen (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log ("Ruta:" + "/Turismo_Rural/" + this.id + "/" + item.id);

      this.af_storage.storage.ref ("/Turismo_Rural/" + this.id + "/" + item.id).delete ()
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

    const filePath = '/Turismo_Rural/' + this.id + "/" + id;
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
