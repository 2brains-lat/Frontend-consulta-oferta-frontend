import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoconsultaComponent } from './resultadoconsulta.component';

describe('ResultadoconsultaComponent', () => {
  let component: ResultadoconsultaComponent;
  let fixture: ComponentFixture<ResultadoconsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultadoconsultaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadoconsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
