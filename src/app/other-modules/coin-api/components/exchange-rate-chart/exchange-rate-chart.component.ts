import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  IChartExchangeRate,
  TrendColor,
} from 'otherModules/svg-charts/interfaces/i-chart-line-rate';
import { ICoinApiExchangeRate } from 'otherModules/coin-api/interfaces/i-coin-api-exchange-rate';
import { Subject } from 'rxjs';
import { BP_ANIM_APPEAR_UP_DOWN } from 'src/app/animations/bp-anim-appear-up-down';

@Component({
  selector: 'app-exchange-rate-chart',
  templateUrl: './exchange-rate-chart.component.html',
  styleUrls: ['./exchange-rate-chart.component.scss'],
  animations: [BP_ANIM_APPEAR_UP_DOWN(350)],
})
export class ExchangeRateChartComponent implements OnInit {
  @Input('data') data = [] as ICoinApiExchangeRate[];
  _data = [] as ICoinApiExchangeRate[];
  chartPoints = [] as IChartExchangeRate[];
  chartVerticalLines = Array.from(Array(11).keys());
  chartHorizontalLines = Array.from(Array(3).keys());
  isDestroyed$ = new Subject() as Subject<boolean>;
  isSelected = false;

  selectedRate = null as IChartExchangeRate | null;
  selectedPosition = {};

  timeMax = new Date();
  timeMin = new Date();
  timeDiff = 0 as number;
  valueMin = 0;
  valueMax = 100;
  valueDiff = 50;

  constructor() {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    // this.initData();
    // this.drawRates();
  }

  test(): void {
    console.log(this.chartPoints);
  }
}
