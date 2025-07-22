import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglasDeNegocioComponent } from './reglas-de-negocio.component';

describe('ReglasDeNegocioComponent', () => {
  let component: ReglasDeNegocioComponent;
  let fixture: ComponentFixture<ReglasDeNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReglasDeNegocioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReglasDeNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
