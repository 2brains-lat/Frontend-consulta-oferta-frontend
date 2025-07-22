import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrosMaestrosComponent } from './otros-maestros.component';

describe('OtrosMaestrosComponent', () => {
  let component: OtrosMaestrosComponent;
  let fixture: ComponentFixture<OtrosMaestrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtrosMaestrosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OtrosMaestrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
