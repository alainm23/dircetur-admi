import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogComponent } from './blog.component';
import { AgregarBlogComponent } from './agregar-blog/agregar-blog.component';
import { VerBlogComponent } from './ver-blog/ver-blog.component';
import { BlogDetalleComponent } from './blog-detalle/blog-detalle.component';
import { EditarEtiquetasComponent } from './editar-etiquetas/editar-etiquetas.component';

const routes: Routes = [{
  path: '',
  component: BlogComponent,
  children: [
    {
      path: 'agregar-blog',
      component: AgregarBlogComponent,
    },
    {
      path: 'ver-blog',
      component: VerBlogComponent,
    },
    {
      path: 'blog-detalle/:id/:idioma',
      component: BlogDetalleComponent,
    },
    {
      path: 'editar-etiquetas',
      component: EditarEtiquetasComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class BlogRoutingModule {
}