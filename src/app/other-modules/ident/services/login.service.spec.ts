import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { IndicatorsModule } from 'otherModules/indicators/indicators.module';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, IndicatorsModule],
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
