import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroPrecioComponent } from './maestro-precio.component';

describe('MaestroPrecioComponent', () => {
  let component: MaestroPrecioComponent;
  let fixture: ComponentFixture<MaestroPrecioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroPrecioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaestroPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
