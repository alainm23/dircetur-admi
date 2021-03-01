import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSolicitanteComponent } from './listar-solicitante.component';

describe('ListarSolicitanteComponent', () => {
  let component: ListarSolicitanteComponent;
  let fixture: ComponentFixture<ListarSolicitanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarSolicitanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarSolicitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
