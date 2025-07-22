import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerisureMulticheckboxComponent } from './verisure-multicheckbox.component';

describe('VerisureMulticheckboxComponent', () => {
  let component: VerisureMulticheckboxComponent;
  let fixture: ComponentFixture<VerisureMulticheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerisureMulticheckboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerisureMulticheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
