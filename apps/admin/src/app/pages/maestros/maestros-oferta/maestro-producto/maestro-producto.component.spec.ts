import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroProductoComponent } from './maestro-producto.component';

describe('MaestroProductoComponent', () => {
  let component: MaestroProductoComponent;
  let fixture: ComponentFixture<MaestroProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroProductoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaestroProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
