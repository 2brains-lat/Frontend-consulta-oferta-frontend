import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenResumenComponent } from './screen-resumen.component';

describe('ScreenResumenComponent', () => {
  let component: ScreenResumenComponent;
  let fixture: ComponentFixture<ScreenResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenResumenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
