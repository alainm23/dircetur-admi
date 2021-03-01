import { Component, OnInit } from '@angular/core';

import { NbDialogRef } from '@nebular/theme';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
const algoliasearch = require('algoliasearch');

@Component({
  selector: 'ngx-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit {
  search_term: string;
  algolia_index: any;
  
  items: any [];
  constructor(protected ref: NbDialogRef<BuscadorComponent>,
              private router: Router) { }

  ngOnInit() {
    const client = algoliasearch (environment.algolia.appId, environment.algolia.apiKey);
    this.algolia_index = client.initIndex(environment.algolia.indexName);
  }

  search_changed () {
    if (this.search_term != "") {
      console.log (this.search_term);
      this.algolia_index.search({
        query: this.search_term
        //attributesToRetrieve: ['primary_text', 'secondary_text', 'id', 'type', "avatar"]
      }).then((data: any)=>{
        console.log ('algolia_search', data);

        this.items = [];  
        if (data.hits.length > 0) {
          this.items = data.hits;
        }
      });
    } else {
      this.items = [];
    }
  }
  
  ver_detalles (item: any) {
    if (item.tipo === 'agencia') {
      this.router.navigate(['/pages/agencia/agencia-detalle', item.objectID]);
    }
  
    this.ref.close ();
  }

  close () {
    this.ref.close ();
  }
}
