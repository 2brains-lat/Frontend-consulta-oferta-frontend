import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestrosLayoutComponent } from './maestros-layout.component';

describe('MaestrosLayoutComponent', () => {
  let component: MaestrosLayoutComponent;
  let fixture: ComponentFixture<MaestrosLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestrosLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaestrosLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
