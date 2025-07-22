import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaileddownloadComponent } from './faileddownload.component';

describe('FaileddownloadComponent', () => {
  let component: FaileddownloadComponent;
  let fixture: ComponentFixture<FaileddownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaileddownloadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FaileddownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
