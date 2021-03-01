import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarSolicitudComponent } from './aprobar-solicitud.component';

describe('AprobarSolicitudComponent', () => {
  let component: AprobarSolicitudComponent;
  let fixture: ComponentFixture<AprobarSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
