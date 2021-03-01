import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { DatabaseService } from "../services/database.service";
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';

import { first } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

// Firebase
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logeado: boolean = true;
  usuario: any;
  menu: any [];
  custom_token: string = "";
  constructor(public afAuth: AngularFireAuth,
              public router: Router,
              private menuService: NbMenuService,
              public database: DatabaseService) {
    this.initMenu ();         
  }

  initMenu () {
    this.menu = [
      {
        acceso: ['admi'],
        title: 'Principal',
        icon: 'home-outline',
        link: '/pages/home',
      },
      {
        acceso: ['admi'],
        title: 'Prestadores turísticos',
        icon: 'map',
        children: [
          {
            title: 'Agencia de Viajes y Turismo',
            children: [
              {
                title: 'Reporte general',
                link: '/pages/agencia/lista-agencias',
              },
              {
                title: 'Rechazos',
                link: '/pages/agencia/rechazos/Agencias',
              },
              {
                title: 'Registro de Agencias',
                link: '/pages/agencia/agregar-agencia',
              },
              {
                title: 'Data interna',
                children: [
                  {
                    title: 'Clasificaciones',
                    link: '/pages/agencia/editar-clasificacion',
                  },
                  {
                    title: 'Tipos de turismo',
                    link: '/pages/agencia/editar-tipos-turismo',
                  }
                ]
              }
            ]
        },
        {
          title: 'Est. de Hospedaje',
          children: [
            {
              title: 'Reporte general',
              link: '/pages/alojamiento/lista-alojamientos',
            },
            {
              title: 'Rechazos',
              link: '/pages/agencia/rechazos/Alojamientos',
            },
            {
              title: 'Registrar Est. de Hospedaje',
              link: '/pages/alojamiento/agregar-hotel',
            },
            {
              title: 'Data interna',
              children: [
                {
                  title: 'Clasificaciones',
                  link: '/pages/alojamiento/editar-clasificacion',
                }
              ]
            }
          ]
        },
        {
          title: 'Restaurantes',
          children: [
            {
              title: 'Reporte general',
              link: '/pages/restaurante/lista-restaurantes',
            },
            {
              title: 'Registrar Restaurantes',
              link: '/pages/restaurante/agregar-restaurante',
            },
            {
              title: 'Data interna',
              children: [
                {
                  title: 'Clasificaciones',
                  link: '/pages/restaurante/editar-clasificacion',
                },
                {
                  title: 'Categorias',
                  link: '/pages/restaurante/editar-categoria',
                }
              ]
            }
          ]
        },
        {
          title: 'Guias Of. de Turismo',
          children: [
            {
              title: 'Reporte general',
              link: '/pages/guia/lista-guias',
            },
            {
              title: 'Registrar Guias Of. de Turismo',
              link: '/pages/guia/agregar-guia',
            },
            {
              title: 'Data interna',
              children: [
                {
                  title: 'Idiomas',
                  link: '/pages/guia/editar-idioma',
                },
                {
                  title: 'Asociaciones/Colegios',
                  link: '/pages/guia/editar-asociacion-colegio',
                },
                {
                  title: 'Centro de Formacion',
                  link: '/pages/guia/editar-centro-formacion',
                },
                {
                  title: 'Tipos de Guiado',
                  link: '/pages/guia/editar-tipos-guiado',
                }
              ]
            }
          ]
        },
        {
          title: 'Data interna',
          children: [
            {
              title: 'Reconocimientos',
              link: '/pages/agencia/reconocimientos-crud'
            },
            {
              title: 'Sanciones',
              link: '/pages/agencia/saciones-crud'
            },
          ]
        }
      ]
      },
      {
        acceso: ['admi'],
        title: 'Viajes programados',
        icon: 'map',
        children: [
          {
            title: 'Panel general',
            link: '/pages/viaje-programado/viaje-programado-panel',
          },
          {
            title: 'Procesar viajeros',
            link: '/pages/viaje-programado/personas',
          },
        ]
      },
      {
        acceso: ['admi', 'etiquetas'],
        title: 'Pagina web',
        icon: 'map',
        children: [
            {
              title: 'Administras Web',
              icon: 'edit-outline',
              url: 'https://web-edit-dirceturcuscoapp.firebaseapp.com/login/' + this.custom_token,
              target: '_blank',
            },
            {
              title: 'Sobre Dircetur',
              icon: 'layers',
              children: [
                  {
                  title: 'Junta Directiva',
                  link: '/pages/sobre-dircetur/junta-directiva',
                  },
                  {
                  title: 'Funciones',
                  link: '/pages/sobre-dircetur/funciones',
                  }
            ]
            },
            {
              title: 'Preguntas Frecuentes',
              icon: 'question-mark-circle',
              children: [
                  {
                  title: 'Preguntas',
                  link: '/pages/FAQ/listar-faq',
                  },
                  {
                  title: 'Categorias',
                  link: '/pages/FAQ/editar-categorias',
                  }
            ]
            },
            {
            title: 'Calendario',
            icon: 'calendar',
            children: [
                {
                title: 'Agregar Eventos',
                link: '/pages/eventos/agregar-eventos',
                },
                {
                title: 'Listar Eventos',
                link: '/pages/eventos/ver-eventos',
                }
                ,
                {
                title: 'Tipos',
                link: '/pages/eventos/editar-tipos', 
                }
            ]
            },
            {
            title: 'Blog',
            icon: 'text',
            children: [
                {
                title: 'Agregar Blog',
                link: '/pages/blog/agregar-blog',
                },
                {
                title: 'Listar Blogs',
                link: '/pages/blog/ver-blog', 
                },
                {
                title: 'Categorias',
                link: '/pages/blog/editar-etiquetas', 
                }
            ]
            },
            {
            title: 'Circuito Turistico',
            icon: 'navigation-2',
            children: [
                {
                  title: 'Agregar Circuito Tiristico',
                  link: '/pages/circuito-turistico/agregar-circuito-turistico',
                },
                {
                  title: 'Listar Circuito Tiristico',
                  link: '/pages/circuito-turistico/listar-circuitos',
                }
            ]
            },   
            {
            title: 'Turismo Rural',
            icon: 'navigation-2',
            children: [
                {
                title: 'Agregar Turismo Rural',
                link: '/pages/turismo-rural/agregar-turismo-rural',
                },
                {
                title: 'Listar Turismo Rura',
                link: '/pages/turismo-rural/listar-turismo-rural',
                }
            ]
            },
            {
            title: 'Boleto turistico',
            icon: 'navigation-2',
            children: [
                {
                  title: 'Boletos turisticos',
                  link: '/pages/boleto-turistico/agregar-boleto',
                },
                {
                  title: 'Museos',
                  link: '/pages/boleto-turistico/agregar-museo',
                },
                {
                  title: 'Parques arqueologicos',
                  link: '/pages/boleto-turistico/agregar-parques-arqueologico',
                }
            ]
            },
            {
              title: 'Transparencia',
              icon: 'navigation-2',
              children: [
                {
                  title: 'Agregar documento',
                  link: '/pages/transparencia/agregar-item',
                },
                {
                  title: 'Gestionar categorias',
                  link: '/pages/transparencia/editar-categorias',
                }
              ]
            }
        ]
      },
      {
        acceso: ['admi', 'presupuesto'],
        title: 'Control presupuestal',
        icon: 'map',
        children: [
          {
            title: 'Reporte general',
            icon: 'navigation-2',
            link : '/pages/solicitudes/reporte-general'
          },
          {
            title: 'Registrar solicitud',
            icon: 'navigation-2',
            link: '/pages/solicitudes/registrar-solicitudv2',
          },
          {
            title: 'Procesar solicitudes',
            icon: 'navigation-2',
            link: '/pages/solicitudes/procesar-solicitudes',
          },
          {
            title: 'Historial beneficiario',
            icon: 'navigation-2',
            link: '/pages/solicitudes/buscar-solicitante',
          },
          {
            title: 'Data interna',
            icon: 'navigation-2',
            children: [
              {
                title: 'Asuntos',
                icon: 'navigation-2',
                link: '/pages/asuntos/listar-asuntos',
              },
              {
                title: 'Capacitaciones',
                icon: 'navigation-2',
                link: '/pages/capacitaciones/listar-capas',
              },
            ]
          } 
        ] 
      }
    ];
  }

  async isLogin (){
    return await this.afAuth.authState.pipe(first()).toPromise();  
  }
  
  public authState () {
    return this.afAuth.authState;
  }

  public signInWithEmailAndPassword (email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword (email, password);
  }

  public signOut () {
    return this.afAuth.auth.signOut ();
  }

  set_usuario (user: any) {
    this.usuario = user;
    
    this.menu.forEach ((item: any) => {
      if (item.acceso.includes (this.usuario.tipo_usuario) === false) {
        item.hidden = true;
      }
    });
  }

  do () {
    let provider = new firebase.auth.OAuthProvider('google.com');
  }
}
