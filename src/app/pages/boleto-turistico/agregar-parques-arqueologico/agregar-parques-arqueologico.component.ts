import { Component, OnInit } from '@angular/core';

import { FormGroup , FormControl, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'ngx-agregar-parques-arqueologico',
  templateUrl: './agregar-parques-arqueologico.component.html',
  styleUrls: ['./agregar-parques-arqueologico.component.scss']
})
export class AgregarParquesArqueologicoComponent implements OnInit {
  form: FormGroup;
  is_loading: boolean = false;

  file: any;
  image: any = "";
  has_image: boolean = false;
  uploadPercent: number = 0;
  items: any [];
  constructor(public database: DatabaseService,
    private af_storage: AngularFireStorage,
    private dialogService: NbDialogService,
    public toastrService: NbToastrService) { }

  ngOnInit () {
    this.form = new FormGroup ({
      id: new FormControl (''),
      imagen: new FormControl (''),
      titulo: new FormControl ('', [Validators.required]),
      detalle: new FormControl ('', [Validators.required])
    });

    this.database.get_parques_Arqueologicos ().subscribe ((res: any []) => {
      this.items = res;
    })
  }

  close_dialog (ref: any) {
    ref.close ();
    this.form.reset ();
  }

  open_registrar (dialog: any) {
    this.dialogService.open (dialog);
  }

  elimninar (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log (item);
      this.database.delete_parques_Arqueologicos (item.id)
      .then (() => {
        console.log ("Elininado");
      })
      .catch (error => {
        console.log ("error", error);
      });
    } else {
      console.log ("Cancelar");
    }
  }

  submit () {
    console.log (this.form.value);

    let data: any = this.form.value;
    
    data.id = this.database.createId ();
    data.fecha_creado = new Date().toISOString ();

    this.is_loading = true;

    console.log (data);

    if (this.has_image) {
      const file = this.file
      const filePath = 'Parques_Arqueologicos/' + data.id + "/" + "imagen";
      const fileRef = this.af_storage.ref (filePath);
      const task = this.af_storage.upload (filePath, file);

      // observe percentage changes
      task.percentageChanges().subscribe ((res) => {
        this.uploadPercent = res;
      });

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL ().subscribe ((url: string) => {
              data.imagen = url;

              this.database.addParques_Arqueologicos (data)
                .then (() => {
                  this.is_loading = false;
                  this.showToast ('top-right');
                  
                  this.form.reset ();
                  this.image = "";
                  this.has_image = false;
                  this.file = "";
                  this.uploadPercent = 0;
                }).catch ((error: any) => {
                  this.is_loading = false;
                  console.log ("Error addAgencia", error);
                });
            });
          })
      )
      .subscribe()
    } else {
      this.database.addParques_Arqueologicos (data)
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
      'El Parques Arqueologico: ' + this.form.value.titulo + ' se agrego correctamente',
      { position });
  }

  changeListener (event: any) : void {
    this.file = event.target.files[0];
    this.has_image = true;
    this.getBase64 (this.file);
  }

  getBase64(file: any) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      this.image = reader.result;
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
