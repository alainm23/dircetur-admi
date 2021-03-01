import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { NotFoundComponent } from './not-found.component';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
  ],
  declarations: [
    NotFoundComponent,
  ],
})
export class NotFoundModule { }