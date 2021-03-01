import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../../../services/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-rechazos',
  templateUrl: './rechazos.component.html',
  styleUrls: ['./rechazos.component.scss']
})
export class RechazosComponent implements OnInit {
  lista_cargando: boolean = true;
  items: any [] = [];

  constructor (private database: DatabaseService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe (params => {
      this.database.get_rechazos_tipo (params['tipo']).subscribe ((res: any []) => {
        this.items = res;
        console.log (res);
        this.lista_cargando = false;
      })
    });
  }
}
