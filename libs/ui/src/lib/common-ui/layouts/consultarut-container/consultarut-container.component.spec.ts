import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarutContainerComponent } from './consultarut-container.component';

describe('ConsultarutContainerComponent', () => {
  let component: ConsultarutContainerComponent;
  let fixture: ComponentFixture<ConsultarutContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultarutContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarutContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
