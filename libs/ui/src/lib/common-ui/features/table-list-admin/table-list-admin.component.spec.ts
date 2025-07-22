import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListAdminComponent } from './table-list-admin.component';

describe('TableListAdminComponent', () => {
  let component: TableListAdminComponent;
  let fixture: ComponentFixture<TableListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableListAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
