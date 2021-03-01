import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../../services/database.service';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { NbToastrService, NbComponentStatus, NbDialogRef } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';

import { first } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'ngx-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss']
})
export class PersonasComponent implements OnInit {
  form_dni: FormGroup;
  form: FormGroup;

  items: any [] = [];

  is_loading: boolean = false;
  is_list_loading: boolean = false;
  was_found: boolean = false;
  usuario: any;

  form_disabled: boolean = true;
  constructor(private database: DatabaseService,
              private toastrService: NbToastrService) { }

  ngOnInit() {
    this.form_dni = new FormGroup ({
      dni: new FormControl (74233791, [Validators.required])
    });

    this.form = new FormGroup ({
      nombre_completo: new FormControl ({ value: '', disabled: this.form_disabled }, [Validators.required]),
      correo: new FormControl ({ value: '', disabled: this.form_disabled },  [Validators.required, Validators.email]),
      telefono: new FormControl ({ value: '', disabled: this.form_disabled }, [Validators.required]),
      fecha_nacimiento: new FormControl ({ value: '', disabled: this.form_disabled }, [Validators.required])
    });
  }

  buscar () {
    this.is_loading = true;

    this.database.getUsuarioViajeProgramado (String (this.form_dni.value.dni)).subscribe ((res) => {
      console.log (res);

      if (res === null || res === undefined) {
        this.showToast ('Usuario no encontrado', 'El usuario no se encuentra registrado en nuestra baseb de datos', 'danger');
        this.form_dni.reset ();
      } else {
        this.get_viajes ();
        this.was_found = true;
        this.usuario = res;
        this.form.patchValue (res);
      }

      this.is_loading = false;
    });
  }

  get_viajes () {
    this.is_list_loading = true;
    
    this.database.getUsuarioViajesRealizados (String (this.form_dni.value.dni)).subscribe ((res: any []) => {
      console.log (res);
      this.items = res;
      this.is_list_loading = false;
    });
  }

  showToast (title: any, body: string, status: NbComponentStatus) {
    const duration: any = 5000;
    const position: any = 'top-right';
    this.toastrService.show(
      body,
      title,
      { position, status, duration });
  }

  getDateFormat (date: string) {
    return moment (date).format ('ll');
  }
}
