import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerisureTableComponent } from './verisure-table.component';

describe('VerisureTableComponent', () => {
  let component: VerisureTableComponent;
  let fixture: ComponentFixture<VerisureTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerisureTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerisureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
