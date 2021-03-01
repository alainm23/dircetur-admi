import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { WebComponent } from './web.component';
import { WebRoutingModule } from './web-routing.module';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    WebRoutingModule,
    ThemeModule,
    NbMenuModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    WebComponent,
    HomeComponent
  ],
})
export class WebModule {
}
