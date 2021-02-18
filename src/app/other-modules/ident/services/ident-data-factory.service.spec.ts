import { TestBed } from '@angular/core/testing';

import { IdentDataFactoryService } from './ident-data-factory.service';

describe('IdentDataFactoryService', () => {
  let service: IdentDataFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentDataFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
