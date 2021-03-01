import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluarSolicitanteComponent } from './evaluar-solicitante.component';

describe('EvaluarSolicitanteComponent', () => {
  let component: EvaluarSolicitanteComponent;
  let fixture: ComponentFixture<EvaluarSolicitanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluarSolicitanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluarSolicitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
