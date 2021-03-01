import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapaDetalleComponent } from './capa-detalle.component';

describe('CapaDetalleComponent', () => {
  let component: CapaDetalleComponent;
  let fixture: ComponentFixture<CapaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
