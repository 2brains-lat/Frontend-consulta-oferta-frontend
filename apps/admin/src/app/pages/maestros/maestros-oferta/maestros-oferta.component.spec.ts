import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestrosOfertaComponent } from './maestros-oferta.component';

describe('MaestrosOfertaComponent', () => {
  let component: MaestrosOfertaComponent;
  let fixture: ComponentFixture<MaestrosOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaestrosOfertaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestrosOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
