import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetalleSolicitudComponent } from './ver-detalle-solicitud.component';

describe('VerDetalleSolicitudComponent', () => {
  let component: VerDetalleSolicitudComponent;
  let fixture: ComponentFixture<VerDetalleSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerDetalleSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerDetalleSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
