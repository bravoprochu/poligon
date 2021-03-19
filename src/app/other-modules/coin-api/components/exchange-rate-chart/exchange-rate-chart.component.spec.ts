import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateChartComponent } from './exchange-rate-chart.component';

describe('ExchangeRateChartComponent', () => {
  let component: ExchangeRateChartComponent;
  let fixture: ComponentFixture<ExchangeRateChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRateChartComponent ]
    })
    .compileComponents();
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
