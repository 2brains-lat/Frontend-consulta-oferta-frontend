import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarListAdminComponent } from './searchbar-list-admin.component';

describe('SearchbarListAdminComponent', () => {
  let component: SearchbarListAdminComponent;
  let fixture: ComponentFixture<SearchbarListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbarListAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
