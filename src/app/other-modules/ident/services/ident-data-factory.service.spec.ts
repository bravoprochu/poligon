import { TestBed } from '@angular/core/testing';
import { IdentModule } from '../ident.module';

import { IdentDataFactoryService } from './ident-data-factory.service';

describe('IdentDataFactoryService', () => {
  let service: IdentDataFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IdentModule],
    });
    service = TestBed.inject(IdentDataFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
