import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturesComponent } from './signatures.component';

describe('SignaturesComponent', () => {
  let component: SignaturesComponent;
  let fixture: ComponentFixture<SignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignaturesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
