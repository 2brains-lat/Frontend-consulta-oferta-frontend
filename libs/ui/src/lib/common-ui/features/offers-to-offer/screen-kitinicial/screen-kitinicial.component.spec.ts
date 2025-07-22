import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenKitinicialComponent } from './screen-kitinicial.component';

describe('ScreenKitinicialComponent', () => {
  let component: ScreenKitinicialComponent;
  let fixture: ComponentFixture<ScreenKitinicialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenKitinicialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenKitinicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
