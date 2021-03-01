import { Component, OnInit } from '@angular/core';

import { FormGroup , FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NbToastrService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';

@Component({
  selector: 'ngx-capa-detalle',
  templateUrl: './capa-detalle.component.html',
  styleUrls: ['./capa-detalle.component.scss']
})
export class CapaDetalleComponent implements OnInit {
form: FormGroup;
id: string;

  constructor(public database: DatabaseService,
    private route: ActivatedRoute,
    public toastrService: NbToastrService,
    private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup ({
      id: new FormControl (''),
      nombre: new FormControl ('', [Validators.required])
    });
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.database.getCapacitacionesById (this.id).subscribe ((d: any) => {
        console.log('objeto',d);
        this.form.patchValue (d);
        
      });
    });

  }

  elimninar () {
    var opcion = confirm("¿Esta usted seguro que desea eliminar esta información?");
    if (opcion == true) {
      this.database.removeCapacitaciones (this.form.value)
      .then (() => {
        console.log ("Elininado");
        this.router.navigate(['/pages/capacitaciones/listar-capas']);
      })
      .catch (error => {
        console.log ("error", error);
      });
    } else {
      console.log ("Cancelar");
    }
  }

  submit () {
    let data: any = this.form.value;

    this.database.updateCapacitaciones (data)
      .then (() => {
        this.showToast ('top-right');
        this.router.navigate(['/pages/capacitaciones/listar-capas']);
      }).catch ((error: any) => {
        console.log ("Error", error);
      });
  }

  regresarListado () {
    this.router.navigate(['/pages/capacitaciones/listar-capas']);
  }

  showToast (position) {
    this.toastrService.show(
      '',
      'Se actualizo con éxito.',
      { position });
  }

}
