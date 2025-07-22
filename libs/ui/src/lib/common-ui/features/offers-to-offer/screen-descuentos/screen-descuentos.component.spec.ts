import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenDescuentosComponent } from './screen-descuentos.component';

describe('ScreenDescuentosComponent', () => {
  let component: ScreenDescuentosComponent;
  let fixture: ComponentFixture<ScreenDescuentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenDescuentosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenDescuentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
