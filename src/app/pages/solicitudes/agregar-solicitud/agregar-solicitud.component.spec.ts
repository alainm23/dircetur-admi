import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSolicitudComponent } from './agregar-solicitud.component';

describe('AgregarSolicitudComponent', () => {
  let component: AgregarSolicitudComponent;
  let fixture: ComponentFixture<AgregarSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
