import { TestBed } from '@angular/core/testing';

import { ConsultaOfertaService } from './consulta-oferta.service';

describe('ConsultarutService', () => {
  let service: ConsultaOfertaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaOfertaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
