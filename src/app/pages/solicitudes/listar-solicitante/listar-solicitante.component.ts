import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { Router } from '@angular/router'; 
import { NbToastrService } from '@nebular/theme';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NbDialogService } from '@nebular/theme';
import { VerDetalleSolicitudComponent } from '../../../dialogs/ver-detalle-solicitud/ver-detalle-solicitud.component';
import { EditarBeneficiarioComponent } from '../../../dialogs/editar-beneficiario/editar-beneficiario.component';

@Component({
  selector: 'ngx-listar-solicitante',
  templateUrl: './listar-solicitante.component.html',
  styleUrls: ['./listar-solicitante.component.scss']
})
export class ListarSolicitanteComponent implements OnInit {
form_ndoc: FormGroup;
detalle: any;
item_seleccionado: any;
provincias: any [];
distritos: any [];
esta_distritos_cargando: boolean = true;
resultsolicitante: boolean = false;
resultsolicitudes: boolean = false;
subscribe_01: any;
subscribe_02: any;
subscribe_03: any;
estado_natural: boolean = false;
estado_juridico: boolean = false;
solicitudes: any [];
is_loading: boolean = true;
estados_solicitudes: any [] = [
  {
    value: 0,
    nombre: 'Solicitado',
  },
  {
    value: 1,
    nombre: 'Aprobado',
  },
  {
    value: 2,
    nombre: 'Entregado',
  },
  {
    value: 3,
    nombre: 'Rechazado',
  }
];
  constructor(public database: DatabaseService, 
              private router: Router,
              public toastrService: NbToastrService,
              private dialogService: NbDialogService) { }

  ngOnInit() {
    
    this.form_ndoc = new FormGroup ({
      n_doc: new FormControl ('', Validators.required)
    });
  
  }
  
  formatFecha (fecha:any) {
    return moment(fecha).format('MMMM Do YYYY, h:mm:ss a');
  }

  submitNdoc () {
    this.subscribe_01=this.database.getSolicitanteById (String(this.form_ndoc.value.n_doc))
      .subscribe ((data: any) => {
        console.log('info solicitante=',data);
        if (data==null || data==undefined)
        {
          this.resultsolicitante=false;
          this.resultsolicitudes=false;
          this.showToastError ('top-right');
        }
        else
        {
          this.resultsolicitante=true;
          console.log ('Resultado de la busqueda=',data);
          this.detalle = data;
          if (this.detalle.tipo == 'Natural') {
            this.estado_juridico=false;
            this.estado_natural=true;
          }else{
            this.estado_natural=false;
            this.estado_juridico=true;
          }
          // Todas las solicitudes del Beneficiario
          this.subscribe_02 = this.database.getSolicitudesByIdSolicitante (String(this.form_ndoc.value.n_doc)).subscribe ((response: any []) => {
            if (response==null || response==undefined)
            {
              this.resultsolicitudes=false;
              this.showToastNS ('top-right');
            }
            else
            {
              this.resultsolicitudes=true;
              this.solicitudes = response;
              console.log('Todas las solicitudes del beneficiario',this.solicitudes);
              this.solicitudes.forEach(solicitud => {
                this.estados_solicitudes.forEach(estado => {
                  if (solicitud.estado==estado.value)
                  {
                    solicitud.estadonombre=estado.nombre;
                  }
                });
              });
            }
            
          });
        }
        this.is_loading=false;
      });
  }

  detalleSolicitud (data: any) {
    this.item_seleccionado = data;

    this.dialogService.open (VerDetalleSolicitudComponent, {
      context: {
        id: this.item_seleccionado.id,
      }
    });
  }

  editarBeneficiario (id:string) {
    this.dialogService.open (EditarBeneficiarioComponent, {
      context: {
        id: id,
      }
    });
  }

  showToastError (position) {
    this.toastrService.show(
      '',
      'No existe ningun Beneficiario con el Número de Documento Ingresado.',
      { position });
  }
  showToastNS (position) {
    this.toastrService.show(
      '',
      'El Beneficiario no posee ninguna Solicitud.',
      { position });
  }
  
  ngOnDestroy () {
    if (this.subscribe_01 !== null && this.subscribe_01 !== undefined) {
      this.subscribe_01.unsubscribe ();
    }
  }

}
