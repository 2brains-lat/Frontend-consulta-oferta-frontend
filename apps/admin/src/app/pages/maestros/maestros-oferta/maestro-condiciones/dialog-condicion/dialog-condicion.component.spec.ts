import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCondicionComponent } from './dialog-condicion.component';

describe('DialogCondicionComponent', () => {
  let component: DialogCondicionComponent;
  let fixture: ComponentFixture<DialogCondicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogCondicionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogCondicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
