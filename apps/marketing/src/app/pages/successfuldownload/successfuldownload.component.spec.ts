import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfuldownloadComponent } from './successfuldownload.component';

describe('SuccessfuldownloadComponent', () => {
  let component: SuccessfuldownloadComponent;
  let fixture: ComponentFixture<SuccessfuldownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessfuldownloadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessfuldownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
