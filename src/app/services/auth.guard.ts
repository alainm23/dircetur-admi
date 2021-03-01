import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, 
              private router: Router,
              private database: DatabaseService) {}
 
  canActivate () {
    return this.authService.isLogin ()
      .then (async (user: any) => {
        if (user) {
          const user_data: any = await this.database.getUser (user.uid).pipe (first ()).toPromise ();
          
          if (user_data.tipo_usuario === "admi" || user_data.tipo_usuario === "etiquetas") {
            this.authService.set_usuario (user_data);
            this.authService.logeado = true;

            return true;
          } else {
            return false;
          }

        } else {
          console.log('User is not logged in');
          this.router.navigate(['/login']);
          return false;
        }
      });
  }
}
