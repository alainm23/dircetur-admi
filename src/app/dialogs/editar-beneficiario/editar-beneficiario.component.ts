import { Component, OnInit, Input, TemplateRef} from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router'; 
import { NbDialogService, NbToastrService, NbDialogRef } from '@nebular/theme';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'ngx-editar-beneficiario',
  templateUrl: './editar-beneficiario.component.html',
  styleUrls: ['./editar-beneficiario.component.scss']
})
export class EditarBeneficiarioComponent implements OnInit {
@Input() public id: string;
form: FormGroup;
subscribe_01: any;
beneficiario: any;
estado_natural: boolean = false;
estado_juridico: boolean = false;
  constructor(public database: DatabaseService, 
              public toastrService: NbToastrService,
              private router: Router,
              private dialogService: NbDialogService,
              public authService: AuthService,
              protected dialogRef: NbDialogRef<EditarBeneficiarioComponent>) { }

  ngOnInit() {
    this.form = new FormGroup ({
      tipo: new FormControl (''),
      nombre_completo: new FormControl (''),
      n_doc: new FormControl (''),
      razon_social: new FormControl (''),
      nombre_comercial: new FormControl (''),
      correo: new FormControl ('', [Validators.email]),
      telefono: new FormControl ('', [Validators.required]),
      direccion_completa: new FormControl ('', Validators.required)
    });
    console.log('Este es el id del beneficiario=',this.id);
      this.subscribe_01 = this.database.getSolicitanteById (this.id).subscribe ((d: any) => {
        console.log('Detalle del beneficiario=',d);
        this.beneficiario=d;
        if(d.tipo=="Natural")
          {
            this.estado_juridico=false;
            this.estado_natural=true;

            this.form.controls['nombre_completo'].setValidators([Validators.required]);
          }
          else
          {
            this.form.controls['razon_social'].setValidators([Validators.required]);
            this.form.controls['nombre_comercial'].setValidators([Validators.required]);
            this.estado_natural=false;
            this.estado_juridico=true;
          }
        this.form.patchValue (d);
      });
  }

  submit () {
    let data: any = this.form.value;

    this.database.updateSolicitante (data)
      .then (() => {
        this.dialogRef.close();
        this.showToast ('top-right');
      }).catch ((error: any) => {
        console.log ("Error", error);
      });
  }

  close () {
    this.dialogRef.close();
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
  }

}
