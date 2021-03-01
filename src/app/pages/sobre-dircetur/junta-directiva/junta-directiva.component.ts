import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';

import { DatabaseService } from '../../../services/database.service';
import { NbToastrService } from '@nebular/theme';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';
import { Observable } from "rxjs";

@Component({
  selector: 'ngx-junta-directiva',
  templateUrl: './junta-directiva.component.html',
  styleUrls: ['./junta-directiva.component.scss']
})
export class JuntaDirectivaComponent implements OnInit {
  items: any [] = [];
  form: FormGroup;

  show_nuevo: boolean = false;
  is_nuevo_loading: boolean = false;

  file: any = null;
  avatar_preview: any = null;
  uploadPercent: number = 0;
  constructor (
    private toastrService: NbToastrService,
    private af_storage: AngularFireStorage,
              private database: DatabaseService) { }

  ngOnInit () {
    this.form = new FormGroup ({
      nombre: new FormControl ('', [Validators.required]),
      cargo: new FormControl ('', [Validators.required]),
      correo: new FormControl (''),
      telefono: new FormControl (''),
      avatar: new FormControl ('')
    });

    this.database.getJunta ().subscribe ((res: any []) => {
      this.items = res;
    });
  }

  agregar () {
    this.show_nuevo = true;
  }

  cancelar_nuevo () {
    this.show_nuevo = false;
    this.is_nuevo_loading = false;

    this.file = null;
    this.avatar_preview = null;
    this.uploadPercent = 0;

    this.form.reset ();
  }

  submit () {
    this.is_nuevo_loading = true;
    let data = this.form.value;
    data.id = this.database.createId ();

    if (this.file == null) {
      this.database.addJunta (data)
        .then (() => {
          this.cancelar_nuevo ();
          this.showToast ('top-right', 'El elemento se agrego con exito');
        })
        .catch ((error: any) => {

        });
    } else {
      this.uploadImageAsPromise (this.file, data);
    }
  }

  uploadImageAsPromise (file: any, data: any) {
    const filePath = 'Junta_Directiva/' + data.id;
    const fileRef = this.af_storage.ref (filePath);
    const task = this.af_storage.upload (filePath, file);

    task.percentageChanges().subscribe ((res: any) => {
      this.uploadPercent = res;
    });

    task.snapshotChanges().pipe(
      finalize(async () => {
        let downloadURL = await fileRef.getDownloadURL ().toPromise();

        data.avatar = downloadURL;

        this.database.addJunta (data)
        .then (() => {
          this.cancelar_nuevo ();
          this.showToast ('top-right', 'El elemento se agrego con exito');
        })
        .catch ((error: any) => {

        });
      })
    )
    .subscribe ();
  }

  eliminar (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      this.database.removeJunta (item.id)
        .then (() => {
          this.showToast ('top-right', 'El elemento se elimino con exito');
        })
        .catch ((error: any) => {

        });
    } else {
      console.log ("Cancelar");
    }
  }

  actualizar (item: any) {
    console.log (item);
    this.database.updateJunta (item)
      .then (() => {
        this.showToast ('top-right', 'El elemento se actualizo con exito');
      })
      .catch ((error) => {

      });
  }

  showToast (position, message: string) {
    this.toastrService.show(
      '',
      message,
      { position });
  }

  changeListener (event: any) {
    this.file = event.target.files[0];
    this.getBase64 (this.file);
  }

  getBase64(file: any) {
    var reader = new FileReader ();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      this.avatar_preview = reader.result;
    };
    
    reader.onerror = (error) => {

    };
  }
}
