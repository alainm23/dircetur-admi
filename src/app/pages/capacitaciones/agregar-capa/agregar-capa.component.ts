import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';


import { DatabaseService } from '../../../services/database.service';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-agregar-capa',
  templateUrl: './agregar-capa.component.html',
  styleUrls: ['./agregar-capa.component.scss']
})
export class AgregarCapaComponent implements OnInit {

form: FormGroup;

  constructor(
    public database: DatabaseService,
    public toastrService: NbToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup ({
      nombre: new FormControl ('', [Validators.required])
    });
  }

  async submit () {

    let obj: any = {
      nombre:this.form.value.nombre,
    };

    await this.database.addCapacitaciones(obj);

    this.showToast ('top-right');
    this.form.reset ();
    
  }
  regresarListado () {
    this.router.navigate(['/pages/capacitaciones/listar-capas']);
  }
  showToast (position) {
    this.toastrService.show(
      '',
      'La Capacitación: ' + this.form.value.nombre + ' se agrego correctamente',
      { position });
  }
}
