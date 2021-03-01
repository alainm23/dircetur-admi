import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAsuntoComponent } from './agregar-asunto.component';

describe('AgregarAsuntoComponent', () => {
  let component: AgregarAsuntoComponent;
  let fixture: ComponentFixture<AgregarAsuntoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarAsuntoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAsuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
