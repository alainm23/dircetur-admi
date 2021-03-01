import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// hola alain
import { AuthGuard } from './services/auth.guard';

import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';

import { NbMomentDateModule } from '@nebular/moment';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

// Editor
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// Cookies
import { CookieService } from 'ngx-cookie-service';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Languaje
import { registerLocaleData } from '@angular/common';
import locales from '@angular/common/locales/es-PE';
import { LoginModule } from './login/login.module';

import { ViajeProgramadoPersonasModule } from './dialogs/viaje-programado-personas/viaje-programado-personas.module';
import { ViajeProgramadoPersonasComponent } from './dialogs/viaje-programado-personas/viaje-programado-personas.component';
import { EvaluarSolicitanteComponent } from './dialogs/evaluar-solicitante/evaluar-solicitante.component';
import { EvaluarSolicitanteModule } from './dialogs/evaluar-solicitante/evaluar-solicitante.module';

import { OrderModule } from 'ngx-order-pipe';
import { VerSolicitudComponent } from './dialogs/ver-solicitud/ver-solicitud.component';
import { VerSolicitudModule } from './dialogs/ver-solicitud/ver-solicitud.module';
import { AprobarSolicitudComponent } from './dialogs/aprobar-solicitud/aprobar-solicitud.component';
import { AprobarSolicitudModule } from './dialogs/aprobar-solicitud/aprobar-solicitud.module';
import { VerDetalleSolicitudComponent } from './dialogs/ver-detalle-solicitud/ver-detalle-solicitud.component';
import { EditarBeneficiarioComponent } from './dialogs/editar-beneficiario/editar-beneficiario.component';
import { VerDetalleSolicitudModule } from './dialogs/ver-detalle-solicitud/ver-detalle-solicitud.module';
import { EditarBeneficiarioModule } from './dialogs/editar-beneficiario/editar-beneficiario.module';
import { BuscadorModule } from './dialogs/buscador/buscador.module';
import { BuscadorComponent } from './dialogs/buscador/buscador.component';

registerLocaleData (locales);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    ThemeModule.forRoot(),

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),

    CoreModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase, 'dirceturcusco'),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,

    FormsModule,
    ReactiveFormsModule,

    LoginModule,
    ViajeProgramadoPersonasModule,
    EvaluarSolicitanteModule,
    VerSolicitudModule,
    AprobarSolicitudModule,
    VerDetalleSolicitudModule,
    EditarBeneficiarioModule,
    BuscadorModule,
    OrderModule,
    CKEditorModule
  ],
  bootstrap: [AppComponent],
  providers: [
    AuthGuard,
    CookieService,
    { provide: LOCALE_ID, useValue: 'es-PE' }
  ],
  entryComponents: [
    ViajeProgramadoPersonasComponent,
    EvaluarSolicitanteComponent,
    VerSolicitudComponent,
    AprobarSolicitudComponent,
    VerDetalleSolicitudComponent,
    EditarBeneficiarioComponent, 
    BuscadorComponent
  ]
})
export class AppModule {
}
