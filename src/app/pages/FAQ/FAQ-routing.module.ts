import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FAQComponent } from './FAQ.component';

import { ListarFAQComponent } from './listar-faq/listar-faq.component';
import { EditarCategoriasComponent } from './editar-categorias/editar-categorias.component';
const routes: Routes = [{
  path: '',
  component: FAQComponent,
  children: [
    {
      path: 'listar-faq',
      component: ListarFAQComponent,
    },
    {
        path: 'editar-categorias',
        component: EditarCategoriasComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class FAQRoutingModule {
}