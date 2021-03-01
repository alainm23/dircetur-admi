import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsuntoDetalleComponent } from './asunto-detalle.component';

describe('AsuntoDetalleComponent', () => {
  let component: AsuntoDetalleComponent;
  let fixture: ComponentFixture<AsuntoDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsuntoDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsuntoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
