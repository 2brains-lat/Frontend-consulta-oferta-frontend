import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenPacksComponent } from './screen-packs.component';

describe('ScreenPacksComponent', () => {
  let component: ScreenPacksComponent;
  let fixture: ComponentFixture<ScreenPacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenPacksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
