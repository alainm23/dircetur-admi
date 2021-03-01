import { Component, OnInit } from '@angular/core';

import { FormGroup , FormControl, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'ngx-agregar-boleto-turistico',
  templateUrl: './agregar-boleto-turistico.component.html',
  styleUrls: ['./agregar-boleto-turistico.component.scss']
})
export class AgregarBoletoTuristicoComponent implements OnInit {
  form: FormGroup;
  is_loading: boolean = false;

  file: any;
  image: any = "";
  has_image: boolean = false;
  uploadPercent: number = 0;

  items: any [] = [];
  edit: boolean =  false;
  constructor(public database: DatabaseService,
    private af_storage: AngularFireStorage,
    private dialogService: NbDialogService,
    public toastrService: NbToastrService) { }

  ngOnInit () {
    this.form = new FormGroup ({
      id: new FormControl (''),
      imagen: new FormControl (''),
      titulo: new FormControl ('', [Validators.required]),
      detalle: new FormControl ('', [Validators.required]),
      vigencia: new FormControl ('', [Validators.required]),
      precio_nacional: new FormControl (''),
      precio_extrajero: new FormControl (''),
      precio: new FormControl (''),
    });

    this.database.getBoletosTuristicos ().subscribe ((res: any) => {
      this.items = res;
    });
  }


  close_dialog (ref: any) {
    ref.close ();
    this.form.reset ();
    this.edit = false;
  }

  elimninar (item: any) {
    var opcion = confirm("¿Esta seguro que desea eliminar este boleto turistico?");
    if (opcion == true) {
      console.log (item);
      this.database.deleteBoletosTuristicos (item.id)
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

  open_registrar (dialog: any) {
    this.dialogService.open (dialog);
  }

  editar (item: any, dialog: any) {
    this.edit = true;
    this.dialogService.open (dialog);
    this.form.patchValue (item);
  }

  submit (ref: any) {
    console.log (this.form.value);
    this.is_loading = true;
    let data: any = this.form.value;
    if (this.edit) {
      this.database.update_BoletoTuristico (data).then (() => {
        ref.close ();
        this.is_loading = false;
        this.form.reset ();
      }).catch ((error) => {
        console.log (error);
      });
    } else {
      data.id = this.database.createId ();
      data.fecha_creado = new Date().toISOString ();
      console.log (data);
      if (this.has_image) {
        const file = this.file
        const filePath = 'Boleto_Tiristico/' + data.id + "/" + "imagen";
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

                this.database.addBoletoTuristico (data)
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
        this.database.addBoletoTuristico (data)
          .then (() => {
            ref.close ();
            this.is_loading = false;
            this.showToast ('top-right');
            this.form.reset ();
          }).catch ((error: any) => {
            this.is_loading = false;
            console.log ("Error addAgencia", error);
          });
      } 
    }
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'El boleto turistico: ' + this.form.value.titulo + ' se agrego correctamente',
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
}
