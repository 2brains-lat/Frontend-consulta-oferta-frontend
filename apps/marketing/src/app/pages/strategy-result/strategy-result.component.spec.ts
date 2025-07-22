import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyResultComponent } from './strategy-result.component';

describe('StrategyResultComponent', () => {
  let component: StrategyResultComponent;
  let fixture: ComponentFixture<StrategyResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StrategyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
