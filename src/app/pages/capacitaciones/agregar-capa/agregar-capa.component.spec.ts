import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCapaComponent } from './agregar-capa.component';

describe('AgregarCapaComponent', () => {
  let component: AgregarCapaComponent;
  let fixture: ComponentFixture<AgregarCapaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarCapaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarCapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
