import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesarSolicitudesComponent } from './procesar-solicitudes.component';

describe('ProcesarSolicitudesComponent', () => {
  let component: ProcesarSolicitudesComponent;
  let fixture: ComponentFixture<ProcesarSolicitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesarSolicitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesarSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
