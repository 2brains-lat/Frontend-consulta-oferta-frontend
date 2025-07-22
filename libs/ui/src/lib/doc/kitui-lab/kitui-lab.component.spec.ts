import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KituiLabComponent } from './kitui-lab.component';

describe('KituiLabComponent', () => {
  let component: KituiLabComponent;
  let fixture: ComponentFixture<KituiLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KituiLabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KituiLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
