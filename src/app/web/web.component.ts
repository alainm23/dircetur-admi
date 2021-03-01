import { Component } from '@angular/core';

import { AuthService } from './../services/auth.service';

import { Router } from '@angular/router';

@Component({
  selector: 'ngx-web',
  styleUrls: ['web.component.scss'],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class WebComponent {
  
}
