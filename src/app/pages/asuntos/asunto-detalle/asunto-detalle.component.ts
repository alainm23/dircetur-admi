import { Component, OnInit } from '@angular/core';


import { FormGroup , FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NbToastrService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'ngx-asunto-detalle',
  templateUrl: './asunto-detalle.component.html',
  styleUrls: ['./asunto-detalle.component.scss']
})
export class AsuntoDetalleComponent implements OnInit {
form: FormGroup;
id: string;
  constructor(
    public database: DatabaseService,
    private route: ActivatedRoute,
    public toastrService: NbToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup ({
      id: new FormControl (''),
      nombre: new FormControl ('', [Validators.required])
    });
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.database.getAsuntoById (this.id).subscribe ((d: any) => {
        console.log('objeto',d);
        this.form.patchValue (d);
        
      });
    });
  }
  elimninar () {
    var opcion = confirm("¿Esta usted seguro que desea eliminar esta información?");
    if (opcion == true) {
      this.database.removeAsuntos (this.form.value)
      .then (() => {
        console.log ("Elininado");
        this.router.navigate(['/pages/asuntos/listar-asuntos']);
      })
      .catch (error => {
        console.log ("error", error);
      });
    } else {
      console.log ("Cancelar");
    }
  }
  regresarListado () {
    this.router.navigate(['/pages/asuntos/listar-asuntos']);
  }
  submit () {
    let data: any = this.form.value;

    this.database.updateAsuntos (data)
      .then (() => {
        this.showToast ('top-right');
        this.router.navigate(['/pages/asuntos/listar-asuntos']);
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
}
