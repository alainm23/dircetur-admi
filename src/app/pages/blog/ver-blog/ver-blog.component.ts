import { Component, OnInit, TemplateRef } from '@angular/core';

import { NbDialogService } from '@nebular/theme';
import { DatabaseService } from '../../../services/database.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'ngx-ver-blog',
  templateUrl: './ver-blog.component.html',
  styleUrls: ['./ver-blog.component.scss']
})
export class VerBlogComponent implements OnInit {
  items: any [];
  idioma_seleccionado: string = "es";
  item_seleccionado: any;

  constructor(public database: DatabaseService, 
              private router: Router,
              private dialogService: NbDialogService) { }

  ngOnInit() {
    this.database.getBlogs ().subscribe ((res: any []) => {
      this.items = res;
      console.log (res);
    });
  }

  elimninar (item: any) {
    var opcion = confirm("Eliminar?");
    if (opcion == true) {
      console.log (item);
      this.database.deleteBlog (item)
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

  go_edit (ref: any) {
    if (this.item_seleccionado != null) {
      this.router.navigate(['/pages/blog/blog-detalle/' + this.item_seleccionado.id + "/" +this.idioma_seleccionado]);
    }

    this.close_dialog (ref);
  }

  editar (item: any, dialog: TemplateRef<any>) {
    this.item_seleccionado = item;
    this.dialogService.open(dialog, { context: '' });
  }

  close_dialog (ref: any) {
    ref.close ();

    this.item_seleccionado = null;
    this.idioma_seleccionado = "es";
  }
}
