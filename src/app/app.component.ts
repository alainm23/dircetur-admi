import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';

import { AuthService } from "./services/auth.service";
import { DatabaseService } from './services/database.service';
import { Router } from '@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, 
              private auth: AuthService, 
              private database: DatabaseService,
              public router: Router) {
  }

  async ngOnInit() {
    this.analytics.trackPageViews();
    moment.locale('es');
  }
}
