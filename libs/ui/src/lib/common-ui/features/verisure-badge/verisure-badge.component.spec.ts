import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicBadgeComponent } from './dynamic-badge.component';

describe('DynamicBadgeComponent', () => {
  let component: DynamicBadgeComponent;
  let fixture: ComponentFixture<DynamicBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
