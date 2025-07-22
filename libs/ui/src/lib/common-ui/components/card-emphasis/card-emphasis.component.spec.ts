import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEmphasisComponent } from './card-emphasis.component';

describe('CardEmphasisComponent', () => {
  let component: CardEmphasisComponent;
  let fixture: ComponentFixture<CardEmphasisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEmphasisComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardEmphasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
