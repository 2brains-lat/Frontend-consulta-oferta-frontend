import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroCondicionesComponent } from './maestro-condiciones.component';

describe('MaestroCondicionesComponent', () => {
  let component: MaestroCondicionesComponent;
  let fixture: ComponentFixture<MaestroCondicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroCondicionesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaestroCondicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
