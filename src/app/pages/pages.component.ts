import { Component } from '@angular/core';

import { NbMenuItem } from '@nebular/theme';
import { AuthService } from './../services/auth.service';

import { Router } from '@angular/router';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu *ngIf="auth.logeado" [items]="auth.menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  constructor (public auth: AuthService, public router: Router) {
    
  }
}
