import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { IndicatorsService } from './indicators.service';

describe('IndicatorsService', () => {
  let service: IndicatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MatSnackBarModule] });
    service = TestBed.inject(IndicatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
