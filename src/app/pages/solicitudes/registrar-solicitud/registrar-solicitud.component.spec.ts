import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarSolicitudComponent } from './registrar-solicitud.component';

describe('RegistrarSolicitudComponent', () => {
  let component: RegistrarSolicitudComponent;
  let fixture: ComponentFixture<RegistrarSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
