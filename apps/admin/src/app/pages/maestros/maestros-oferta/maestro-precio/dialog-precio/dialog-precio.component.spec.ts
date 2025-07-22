import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPrecioComponent } from './dialog-precio.component';

describe('DialogPrecioComponent', () => {
  let component: DialogPrecioComponent;
  let fixture: ComponentFixture<DialogPrecioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogPrecioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
