import { Component, OnInit } from '@angular/core';

// Services
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

// Forms
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Cookies
import { CookieService } from 'ngx-cookie-service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;

  deviceInfo: any;
  constructor(public auth: AuthService,   
              public cookieService: CookieService,
              public database: DatabaseService,
              public http: HttpClient,
              public router: Router) { }

  ngOnInit() {
    this.form = new FormGroup ({
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl ('', Validators.required)
    });
  }
  
  generateUUID (){
    return UUID.UUID ()
  }
  
  submit () {
    if (this.loading === false) {
      this.loading = true;

    this.auth.signInWithEmailAndPassword (this.form.value.email, this.form.value.password)
      .then ((user: any) => {
        console.log ('user', user);

        this.database.getUser (user.user.uid).subscribe ((data: any) => {
          console.log ('data', data);

          if (data.tipo_usuario === "admi" || data.tipo_usuario === "etiquetas") {
            this.auth.logeado = true;

            this.router.navigate (['pages/home']);

            // Create user token
            var uuid = this.generateUUID ();
            this.http.get ("https://api-dirceturcuscoapp.web.app/api/v1/get_custom_token/" + uuid).subscribe ((response: any) => {
              console.log ('get_custom_token', response.token);
              this.auth.custom_token = response.token;
            
              this.auth.initMenu ();
              this.auth.set_usuario (data);
            }, error => {
              console.log ('get_custom_token', error);
            });
          } else {
            this.loading = false;
            this.auth.logeado = false;
            this.auth.signOut ();
            alert ("Su usuario no tiene los privilegios para ingresar, comuníquese con el administrador.")
          }
        }, error => {
          this.loading = false;
          this.auth.logeado = false;
          this.auth.signOut ();
          console.log (error);
          alert (error);
        });
      })
      .catch ((error: any) => {
        this.loading = false;
        let errorMessage: string = "";

        if (error.code == "auth/network-request-failed") {
          errorMessage = "No tienes acceso a internet, no se puede proceder."
        } else if (error.code == "auth/user-not-found") {
          errorMessage = "No encontramos a nigun usuario con ese correo";
        } else if (error.code == "auth/wrong-password") {
          errorMessage = "No encontramos a nigun usuario con ese correo";
        } else if (error.code == "auth/too-many-requests") {
          errorMessage = "Hemos bloqueado todas las solicitudes de este dispositivo debido a una actividad inusual. Inténtalo más tarde.";
        } else {
          errorMessage = error.message;
        }

        alert (errorMessage);
      });
    }
  }

  home () {
    this.router.navigate (['pages/home']);
  }
}
