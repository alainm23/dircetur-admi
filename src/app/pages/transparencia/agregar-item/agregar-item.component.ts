import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';

import { DatabaseService } from '../../../services/database.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';
import { Observable } from "rxjs";

@Component({
  selector: 'ngx-agregar-item',
  templateUrl: './agregar-item.component.html',
  styleUrls: ['./agregar-item.component.scss']
})
export class AgregarItemComponent implements OnInit {
  items: any [] = [];
  form: FormGroup;
  categorias: any [] = [];

  show_nuevo: boolean = false;
  is_nuevo_loading: boolean = false;
  is_upload: boolean = false;

  file: any = null;
  uploadPercent: number = 0;

  esta_distritos_cargando: boolean = false;
  subcategorias: any [] = [];
  constructor (
    private database: DatabaseService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private af_storage: AngularFireStorage,
  ) { }

  ngOnInit () {
    this.form = new FormGroup ({
      id: new FormControl (''),
      descripcion: new FormControl ('', [Validators.required]),
      sub_categoria: new FormControl ('', [Validators.required]),
      file: new FormControl ('', [Validators.required]),
      categoria: new FormControl ('', [Validators.required]),
      url: new FormControl ('')
    });

    this.database.getTransparenciaCategorias ().subscribe ((res: any) => {
      this.categorias = res;
    });

    this.database.getTransparenciaMedios ().subscribe ((res: any []) => {
      this.items = res;
      console.log (res);
    });
  }

  agregar () {
    this.show_nuevo = true;
  }

  eliminar_nuevo_file () {
    this.file = null;
    this.form.controls ['file'].setValue ("");
  }

  cancelar_nuevo () {
    this.show_nuevo = false;
    this.is_nuevo_loading = false;

    this.file = null;
    this.uploadPercent = 0;

    this.form.reset ();
  }

  categoriaChanged (event: any) {
    console.log (event);

    this.esta_distritos_cargando = true;
    console.log (event);
    this.database.getSubCategoriasByCategoria (event.id).subscribe ((response: any []) => {
      this.subcategorias = response;
      this.esta_distritos_cargando = false;
    }, (error: any) => {
      console.log ('getDistritosByProvincias', error);
      this.esta_distritos_cargando = true;
    });
  }

  submit () {
    this.is_nuevo_loading = true;
    let data = this.form.value;
    data.id = this.database.createId ();

    if (this.file == null) {
      this.database.add_transparencia_medio (data)
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
    const filePath = 'Transparencia_Medios/' + data.id + '_' + this.file.name;
    const fileRef = this.af_storage.ref (filePath);
    const task = this.af_storage.upload (filePath, file);

    task.percentageChanges().subscribe ((res: any) => {
      this.uploadPercent = res;
    });

    task.snapshotChanges().pipe(
      finalize(async () => {
        let downloadURL = await fileRef.getDownloadURL ().toPromise();
        data.url = downloadURL;

        this.database.add_transparencia_medio (data)
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
      this.database.remove_transparencia_medio (item)
        .then (() => {
          this.af_storage.storage.ref ('Transparencia_Medios/' + item.id + '_' + item.file).delete ()
            .then (() => {
              this.showToast ('top-right', 'El elemento se elimino con exito');
            })
            .catch (error => {
              console.log ("error", error);
            });
        })
        .catch ((error: any) => {

        });
    } else {
      console.log ("Cancelar");
    }
  }

  showToast (position, message: string) {
    this.toastrService.show(
      '',
      message,
      { position });
  }

  changeListener (event: any) {
    this.file = event.target.files [0];
    this.form.controls ['file'].setValue (this.file.name);
  }

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
  }

  actualizar (item: any, dialog: any) {
    console.log (item);

    this.database.getSubCategoriasByCategoria (item.categoria.id).subscribe ((response: any []) => {
      this.subcategorias = response;
      this.dialogService.open (dialog);
      this.form.patchValue (item);
    }, (error: any) => {
      console.log ('getDistritosByProvincias', error);
    });


    // console.log (this.categorias);
    // console.log (this.categorias.find (x => x.id === item.categoria.id));
    // this.form.controls ['categoria'].setValue (this.categorias.find (x => x.id === item.categoria.id));
  }

  close_dialog (ref: any) {
    this.form.reset ();
    ref.close ();
  }

  subir (ref: any) {
    this.is_upload = true;

    this.database.update_transparencia_medio (this.form.value)
      .then (() => {
        this.is_upload = false;
        this.form.reset ();
        ref.close ();
      })
      .catch (() => {
        this.is_upload = false;
        this.form.reset ();
        ref.close ();
      });
  }
}
