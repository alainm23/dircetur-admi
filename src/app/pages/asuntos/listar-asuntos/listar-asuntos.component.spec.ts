import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAsuntosComponent } from './listar-asuntos.component';

describe('ListarAsuntosComponent', () => {
  let component: ListarAsuntosComponent;
  let fixture: ComponentFixture<ListarAsuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarAsuntosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarAsuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
