import { TestBed } from '@angular/core/testing';

import { ColorRangeService } from './color-range.service';

describe('ColorRangeService', () => {
  let service: ColorRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorRangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
