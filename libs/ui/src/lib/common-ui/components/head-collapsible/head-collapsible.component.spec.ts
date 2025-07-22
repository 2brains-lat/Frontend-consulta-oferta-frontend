import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadCollapsibleComponent } from './head-collapsible.component';

describe('HeadCollapsibleComponent', () => {
  let component: HeadCollapsibleComponent;
  let fixture: ComponentFixture<HeadCollapsibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadCollapsibleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeadCollapsibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
