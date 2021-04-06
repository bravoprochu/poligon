import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoinApiRatePairService } from 'otherModules/coin-api/services/coin-api-rate-pair.service';
import { of, Subject } from 'rxjs';

import { ExchangeRateChartComponent } from './exchange-rate-chart.component';

describe('ExchangeRateChartComponent', () => {
  let component: ExchangeRateChartComponent;
  let fixture: ComponentFixture<ExchangeRateChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExchangeRateChartComponent],
      providers: [
        {
          provide: CoinApiRatePairService,
          useValue: {
            ratePairAdded$: of(0),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
