import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  IChartExchangeRate,
  TrendColor,
} from 'otherModules/coin-api/interfaces/chart/i-chart-line-rate';
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue !== changes.data.previousValue) {
      this.initData();
      this.drawRates();
    }
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  initData(): void {
    this.valueMin = Math.min(...this.data.map((rate) => rate.rate));
    this.valueMax = Math.max(...this.data.map((rate) => rate.rate));
    this.valueDiff = this.valueMax - this.valueMin;

    this.checkMinMaxDate();
  }

  checkMinMaxDate(): void {
    let dates = this.data.map((rate) => new Date(rate.time));

    dates = dates.sort();
    this.timeMin = dates[0];
    this.timeMax = dates[dates.length - 1];
    this.timeDiff = this.checkTimeDifference(this.timeMin, this.timeMax);
  }

  checkTimeDifference(dateMin: Date, dateMax: Date): number {
    return dateMax.getTime() - dateMin.getTime();
  }

  id = 0;

  drawRates(): void {
    /**
     * array is from 'newest to oldest
     *
     *
     */
    this.chartPoints = [];
    for (let index = 0; index < this.data.length; index++) {
      this.id++;
      const rate = this.data[index];
      const timeMax = this.timeMax.getTime();

      const valueToMax = ((this.valueMax - rate.rate) / this.valueDiff) * 100;

      const timeRelative =
        this.timeDiff - (timeMax - new Date(rate.time).getTime());

      const timeToMax = (timeRelative / this.timeDiff) * 100;

      const id = this.id;

      /**
       * TREND
       * check current to prev(next) value
       * data array is from newest to oldest
       * so previous (on the left side is the next index (index+1))
       */

      let color = 'green' as TrendColor;
      let isIncreasing = true;

      let valueChange = 0;
      let valueChangePercentage = 0;

      if (index < this.data.length - 1) {
        const prev = this.data[index + 1].rate;
        const current = this.data[index].rate;

        valueChange = current - prev;
        valueChangePercentage = (valueChange / current) * 100;

        isIncreasing = valueChange >= 0 ? true : false;
        color = isIncreasing ? 'green' : 'red';
      }

      const chartExRate = {
        id,
        color,
        isIncreasing,
        rate,
        timeRelative,
        timeToMax,
        valueToMax,
        valueChange,
        valueChangePercentage,
      } as IChartExchangeRate;

      this.chartPoints.unshift(chartExRate);
    }
  }

  getRateColor(index: number): string {
    if (index === 0) {
      return 'red';
    } else {
      const prev = this.chartPoints[index - 1].rate.rate;
      const current = this.chartPoints[index].rate.rate;
      return current < prev ? 'red' : 'green';
    }
  }

  mouseOver(ev: MouseEvent, rate: IChartExchangeRate) {
    this.isSelected = true;
    this.selectedRate = rate;
    this.selectedPosition = {
      left: `${ev.offsetX}px`,
      top: `${ev.offsetY - 50}px`,
    };
  }

  mouseLeave(ev: MouseEvent) {
    this.isSelected = false;
  }

  test(): void {
    console.log(this.chartPoints);
  }
}
