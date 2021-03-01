import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalTransparenciaComponent } from './portal-transparencia.component';

describe('PortalTransparenciaComponent', () => {
  let component: PortalTransparenciaComponent;
  let fixture: ComponentFixture<PortalTransparenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalTransparenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalTransparenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
