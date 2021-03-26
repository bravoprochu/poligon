import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { BP_ANIM_APPEAR_UP_DOWN } from 'src/app/animations/bp-anim-appear-up-down';
import { IChartsSelected } from 'otherModules/coin-api/interfaces/i-charts-selected';
import { IPointChartDataOutput } from 'otherModules/svg-charts/interfaces/i-point-chart-data-output';
import { ISvgChartInfoCard } from 'otherModules/svg-charts/interfaces/i-svg-chart-info-card';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-exchange-rate-chart',
  templateUrl: './exchange-rate-chart.component.html',
  styleUrls: ['./exchange-rate-chart.component.scss'],
  animations: [BP_ANIM_APPEAR_UP_DOWN(350)],
})
export class ExchangeRateChartComponent implements OnInit {
  @Input('selectedChart') selectedChart?: IChartsSelected;
  @Output('chartConfigChange')
  chartConfigChange = new EventEmitter() as EventEmitter<IChartsSelected>;
  isDestroyed$ = new Subject() as Subject<boolean>;
  isSelected = false;
  itemHeight = 20;
  itemOnView = 10;

  configShowHistory$ = new FormControl(true);
  configWidth$ = new FormControl(100);
  configPointsCount$ = new FormControl(100);

  constructor() {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initObservables();
    // this.initData();
    // this.drawRates();
  }

  initObservables(): void {
    const MERGED_FORM_CONTROLS = merge(
      this.configWidth$.valueChanges.pipe(
        map((val: number) => {
          if (val && val >= 10) {
            this.selectedChart!.width = val;
            return val;
          } else {
            return null;
          }
        })
      ),
      this.configPointsCount$.valueChanges.pipe(
        map((val: number) => {
          if (val && val >= 5) {
            this.selectedChart!.pointsCount = val;
            return val;
          } else {
            return null;
          }
        })
      )
    );

    MERGED_FORM_CONTROLS.pipe(
      debounceTime(750),
      distinctUntilChanged(),
      takeUntil(this.isDestroyed$)
    ).subscribe(
      (exchangeRateChartConfig: any) => {
        console.log('exchangeRateChartConfig subs:', exchangeRateChartConfig);
        if (exchangeRateChartConfig) {
          console.log(
            'chart config value OK, update chart !',
            exchangeRateChartConfig
          );
          this.chartConfigChange.emit(this.selectedChart);
        } else {
          console.log(
            'chart config value to low or just invalid',
            exchangeRateChartConfig
          );
        }
      },
      (error) => console.log('exchangeRateChartConfig error', error),
      () => console.log('exchangeRateChartConfig completed..')
    );
  }

  pointSelected(
    ev: IPointChartDataOutput,
    selectedChart: IChartsSelected
  ): void {
    if (ev.id < 0) {
      this.isSelected = false;
      return;
    }

    const RATES = selectedChart.chart.rates.slice(0, 20);

    const CURRENT_RATE = RATES[ev.id];
    if (!CURRENT_RATE) {
      this.isSelected = false;
      return;
    }
    const PREV_RATE = ev.id < RATES.length ? RATES[ev.id + 1] : null;
    const RATE_CHANGE = PREV_RATE ? CURRENT_RATE.rate - PREV_RATE.rate : null;
    const CHANGE_PERCENTAGE = PREV_RATE
      ? ((RATE_CHANGE! / +CURRENT_RATE.rate) * 100).toString() + ' %'
      : '';
    const IS_INCREASING =
      PREV_RATE && CURRENT_RATE.rate >= PREV_RATE.rate ? true : false;
    const date = new Date(CURRENT_RATE.time);

    selectedChart.chart.pointChart.infoCard = {
      change: RATE_CHANGE && RATE_CHANGE != 0 ? RATE_CHANGE!.toString() : '',
      changePercentage: CHANGE_PERCENTAGE != '0 %' ? CHANGE_PERCENTAGE : '',
      color: IS_INCREASING ? 'green' : 'red',
      isIncreasing: IS_INCREASING,
      subtitle: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      title: CURRENT_RATE.rate.toString(),
    } as ISvgChartInfoCard;

    this.isSelected = true;
  }

  test(): void {
    // console.log(this.chartPoints);
  }
}
