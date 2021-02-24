import { TestBed } from '@angular/core/testing';

import { IdentifyGuard } from './identify.guard';

describe('IdentifyGuard', () => {
  let guard: IdentifyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IdentifyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
