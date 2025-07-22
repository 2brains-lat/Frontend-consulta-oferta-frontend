import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOfferInfoComponent } from './card-offer-info.component';

describe('CardOfferInfoComponent', () => {
  let component: CardOfferInfoComponent;
  let fixture: ComponentFixture<CardOfferInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardOfferInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardOfferInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
