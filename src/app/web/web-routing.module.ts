import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { WebComponent } from './web.component';


import { HomeComponent } from './home/home.component';

const routes: Routes = [{
  path: '',
  component: WebComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent,
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: HomeComponent,
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebRoutingModule {
}
