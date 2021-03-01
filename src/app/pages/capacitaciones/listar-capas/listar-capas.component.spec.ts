import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCapasComponent } from './listar-capas.component';

describe('ListarCapasComponent', () => {
  let component: ListarCapasComponent;
  let fixture: ComponentFixture<ListarCapasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarCapasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCapasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
