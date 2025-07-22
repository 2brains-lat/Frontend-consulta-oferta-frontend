import { TestBed } from '@angular/core/testing';

import { MaestrosOfertaService } from './maestros-oferta.service';

describe('MaestrosOfertaService', () => {
  let service: MaestrosOfertaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaestrosOfertaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
