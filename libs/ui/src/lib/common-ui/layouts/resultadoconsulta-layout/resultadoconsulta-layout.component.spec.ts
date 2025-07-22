import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoconsultaLayoutComponent } from './resultadoconsulta-layout.component';

describe('ResultadoconsultaLayoutComponent', () => {
  let component: ResultadoconsultaLayoutComponent;
  let fixture: ComponentFixture<ResultadoconsultaLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultadoconsultaLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadoconsultaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
