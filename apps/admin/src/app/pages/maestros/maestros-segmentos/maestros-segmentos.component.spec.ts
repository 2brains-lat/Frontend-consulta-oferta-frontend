import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestrosSegmentosComponent } from './maestros-segmentos.component';

describe('MaestrosOfertaComponent', () => {
  let component: MaestrosSegmentosComponent;
  let fixture: ComponentFixture<MaestrosSegmentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaestrosSegmentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestrosSegmentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
