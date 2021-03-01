import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSolicitudesComponent } from './all-solicitudes.component';

describe('AllSolicitudesComponent', () => {
  let component: AllSolicitudesComponent;
  let fixture: ComponentFixture<AllSolicitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSolicitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
