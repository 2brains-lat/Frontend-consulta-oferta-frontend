import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConsultarutComponent } from './form-consultarut.component';

describe('FormConsultarutComponent', () => {
  let component: FormConsultarutComponent;
  let fixture: ComponentFixture<FormConsultarutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConsultarutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormConsultarutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
