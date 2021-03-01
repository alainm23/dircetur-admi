import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'ngx-editar-solicitante',
  templateUrl: './editar-solicitante.component.html',
  styleUrls: ['./editar-solicitante.component.scss']
})
export class EditarSolicitanteComponent implements OnInit {
form: FormGroup;
id: string;
subscribe_01: any;
subscribe_02: any;
provincias: any [];
distritos: any [];
esta_distritos_cargando: boolean = true;
estado_natural: boolean = false;
estado_juridico: boolean = false;
  constructor(
    public database: DatabaseService,
    private route: ActivatedRoute,
    public toastrService: NbToastrService
  ) { }

  ngOnInit() {
    this.form = new FormGroup ({
      id: new FormControl (''),
      tipo: new FormControl ('', [Validators.required]),
      nombre_completo: new FormControl ('', [Validators.required]),
      n_doc: new FormControl ('', [Validators.required]),
      razon_social: new FormControl (''),
      nombre_comercial: new FormControl (''),
      correo: new FormControl ('', [Validators.required, Validators.email]),
      telefono: new FormControl ('', [Validators.required]),
      provincia: new FormControl ('', Validators.required),
      distrito: new FormControl ('', Validators.required),
      direccion_completa: new FormControl ('', Validators.required)
    });
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log('Este es el id=',this.id);
      this.database.getSolicitanteById (this.id).subscribe ((d: any) => {
        console.log('objeto',d);
        if(d.tipo=="Natural")
          {
            this.estado_juridico=false;
            this.estado_natural=true;
          }
          else
          {
            this.estado_natural=false;
            this.estado_juridico=true;
          }
        this.form.patchValue (d);
        this.subscribe_01 = this.database.getProvincias ().subscribe ((response: any []) => {
          this.provincias = response;

          this.provinciaChanged (d.provincia);
        });
      });
    });
  }

  provinciaChanged (event: any) {
    this.esta_distritos_cargando = true;
    console.log (event);
    this.subscribe_02 = this.database.getDistritosByProvincias (event.id).subscribe ((response: any []) => {
      this.distritos = response;
      this.esta_distritos_cargando = false;
    }, (error: any) => {
      console.log ('getDistritosByProvincias', error);
      this.esta_distritos_cargando = true;
    });
  }

  compareWith (item_01: any, item_02: any) {
    if (item_01 == null || item_02 == null) {
      return false;
    }

    return item_01.id === item_02.id;
  }

  submit () {
    let data: any = this.form.value;

    this.database.updateSolicitante (data)
      .then (() => {
        this.showToast ('top-right');
      }).catch ((error: any) => {
        console.log ("Error", error);
      });
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'Se actualizo con éxito.',
      { position });
  }

  ngOnDestroy () {
    if (this.subscribe_01 !== null && this.subscribe_01 !== undefined) {
      this.subscribe_01.unsubscribe ();
    }
    if (this.subscribe_02 !== null && this.subscribe_02 !== undefined) {
      this.subscribe_02.unsubscribe ();
    }
  }

}
