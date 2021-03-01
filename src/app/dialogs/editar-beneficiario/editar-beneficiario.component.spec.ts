import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarBeneficiarioComponent } from './editar-beneficiario.component';

describe('EditarBeneficiarioComponent', () => {
  let component: EditarBeneficiarioComponent;
  let fixture: ComponentFixture<EditarBeneficiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarBeneficiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarBeneficiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
