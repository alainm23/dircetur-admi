import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSolicitanteComponent } from './editar-solicitante.component';

describe('EditarSolicitanteComponent', () => {
  let component: EditarSolicitanteComponent;
  let fixture: ComponentFixture<EditarSolicitanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarSolicitanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarSolicitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
