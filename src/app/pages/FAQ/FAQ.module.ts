import { NgModule } from '@angular/core';

import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, 
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbSpinnerModule,
  NbListModule,
  NbCalendarModule,
  NbProgressBarModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { FAQRoutingModule } from './FAQ-routing.module';
import { FAQComponent } from './FAQ.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditarCategoriasComponent } from './editar-categorias/editar-categorias.component';
import { ListarFAQComponent } from './listar-faq/listar-faq.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbListModule,
    FAQRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NbCalendarModule,
    NbProgressBarModule,
    CKEditorModule
  ],
  declarations: [
    FAQComponent,
    EditarCategoriasComponent,
    ListarFAQComponent
  ],
})

export class FAQModule { }
