import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffertReviewComponent } from './offert-review.component';

describe('OffertReviewComponent', () => {
  let component: OffertReviewComponent;
  let fixture: ComponentFixture<OffertReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OffertReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OffertReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
