import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarSolicitudv2Component } from './registrar-solicitudv2.component';

describe('RegistrarSolicitudv2Component', () => {
  let component: RegistrarSolicitudv2Component;
  let fixture: ComponentFixture<RegistrarSolicitudv2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarSolicitudv2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarSolicitudv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
