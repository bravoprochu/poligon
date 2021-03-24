import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IChartConfig } from 'otherModules/coin-api/interfaces/i-charts-config';
import { IChartsSelected } from 'otherModules/coin-api/interfaces/i-charts-selected';
import { ICoinApiExchangeRate } from 'otherModules/coin-api/interfaces/i-coin-api-exchange-rate';
import { ICoinApiExchangeRatePair } from 'otherModules/coin-api/interfaces/i-coin-api-exchange-rate-pair';
import { IKeyValue } from 'otherModules/coin-api/interfaces/i-key-value';
import { RxjsWebsocketService } from 'otherModules/coin-api/services/rxjs-websocket.service';
import { IPointChart } from 'otherModules/svg-charts/interfaces/i-point-chart';
import { IPointChartData } from 'otherModules/svg-charts/interfaces/i-point-chart-data';
import { IPointChartDataOutput } from 'otherModules/svg-charts/interfaces/i-point-chart-data-output';
import { IPointChartSelectedPointInfo } from 'otherModules/svg-charts/interfaces/i-point-chart-selected-point-info';
import { ISvgChartInfoCard } from 'otherModules/svg-charts/interfaces/i-svg-chart-info-card';
import { merge, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'app-rxjs-websockets',
  templateUrl: './rxjs-websockets.component.html',
  styleUrls: ['./rxjs-websockets.component.scss'],
})
export class RxjsWebsocketsComponent implements OnInit {
  isDestroyed$ = new Subject() as Subject<boolean>;
  isSelected = false;
  itemHeight = 20;
  itemOnView = 10;

  coinPairAdded$ = new Subject() as Subject<boolean>;
  coinPairId = 0;
  coinPairs = [] as ICoinApiExchangeRatePair[];
  coinPairsFiltered = [] as ICoinApiExchangeRatePair[];
  coinPairs$ = new FormControl();
  coinPairsSearch$ = new FormControl();
  coinPairsSearchList = [] as ICoinApiExchangeRatePair[];

  infoCard = {} as ISvgChartInfoCard;

  lastPointChart = null as IPointChart | null;
  lastRate = null as ICoinApiExchangeRate | null;

  maxPointsCount$ = new FormControl(10);
  maxPointsCount = 10;

  selectedCharts = [] as IChartsSelected[];

  ratePairOptions = [] as IKeyValue<number>[];
  stopStream$ = new Subject() as Subject<boolean>;

  constructor(private rxjsWebsocketService: RxjsWebsocketService) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initWebsocket();
    this.initObservables();
    // this.coinPairs = this.rxjsWebsocketService.getExchangeRatePairMocked();
    // this.prepMockedData();
  }

  coinPairAutoComplete(pair: ICoinApiExchangeRatePair): string {
    return pair && pair.id ? pair.name : '';
  }

  convertExchangeRateToPointChartData(
    rate: ICoinApiExchangeRate
  ): IPointChartData {
    return {
      x: new Date(rate.time).getTime(),
      y: rate.rate,
    } as IPointChartData;
  }

  initObservables(): void {
    this.maxPointsCount$.valueChanges
      .pipe(
        debounceTime(750),
        distinctUntilChanged(),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(
        (maxPointsCount: any) => {
          if (!isNaN(maxPointsCount) && maxPointsCount > 4) {
            this.maxPointsCount = maxPointsCount;
          }
        },
        (error) => console.log('maxPointsCount error', error),
        () => console.log('maxPointsCount completed..')
      );

    this.coinPairs$.valueChanges
      .pipe(startWith([0]), debounceTime(750), takeUntil(this.isDestroyed$))
      .subscribe(
        (pairSelected: number[]) => {
          console.log('pairSelected subs:', pairSelected);
          this.coinPairsFiltered = [];
          this.coinPairsFiltered = this.coinPairs.filter(
            (f) => f.id === pairSelected.find((p) => p === f.id)
          );
        },
        (error) => console.log('pairSelected error', error),
        () => console.log('pairSelected completed..')
      );

    this.coinPairsSearch$.valueChanges
      .pipe(
        debounceTime(750),
        distinctUntilChanged(),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(
        (coinPairsSearch: string) => {
          console.log('coinPairsSearch subs:', coinPairsSearch);
          if (coinPairsSearch && coinPairsSearch.length > 2) {
            // this.coinPairsSearchList = this.coinPairs.filter((f) =>
            //   f.name.toLowerCase().includes(coinPairsSearch.toLowerCase())
            // );

            console.log(this.coinPairsSearchList);
          }
        },
        (error) => console.log('coinPairsSearch error', error),
        () => console.log('coinPairsSearch completed..')
      );

    this.coinPairAdded$
      .pipe(debounceTime(750), takeUntil(this.isDestroyed$))
      .subscribe(
        (coinPairAdded: any) => {
          console.log('coinPairAdded subs:', coinPairAdded);
          this.prepRatePairAvailableOptions();
        },
        (error) => console.log('coinPairAdded error', error),
        () => console.log('coinPairAdded completed..')
      );
  }

  initWebsocket(): void {
    this.rxjsWebsocketService.ws$
      .pipe(takeUntil(merge(this.stopStream$)))
      .subscribe(
        (rxjsWebsocketPayload: any) => {
          this.prepPairs(rxjsWebsocketPayload as ICoinApiExchangeRate);
        },
        (error) => console.log('rxjsWebsocketPayload error', error),
        () => console.log('rxjsWebsocketPayload completed..')
      );
  }

  getTrades(): void {
    this.rxjsWebsocketService.getExchangeRate();
  }

  pointSelected(
    ev: IPointChartDataOutput,
    selectedChart: IChartsSelected
  ): void {
    if (ev.id < 0) {
      this.isSelected = false;
      return;
    }

    const RATES = selectedChart.chart.rates.slice(0, this.maxPointsCount);

    const CURRENT_RATE = RATES[ev.id];
    const PREV_RATE = ev.id < RATES.length ? RATES[ev.id + 1] : null;
    const RATE_CHANGE = PREV_RATE ? CURRENT_RATE.rate - PREV_RATE.rate : null;
    const CHANGE_PERCENTAGE = PREV_RATE
      ? ((RATE_CHANGE! / +CURRENT_RATE.rate) * 100).toString() + ' %'
      : '';
    const IS_INCREASING =
      PREV_RATE && CURRENT_RATE.rate >= PREV_RATE.rate ? true : false;
    const date = new Date(CURRENT_RATE.time);

    selectedChart.chart.pointChart.infoCard = {
      change: RATE_CHANGE != 0 ? RATE_CHANGE!.toString() : '',
      changePercentage: CHANGE_PERCENTAGE != '0 %' ? CHANGE_PERCENTAGE : '',
      color: IS_INCREASING ? 'green' : 'red',
      isIncreasing: IS_INCREASING,
      subtitle: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      title: CURRENT_RATE.rate.toString(),
    } as ISvgChartInfoCard;

    this.isSelected = true;
  }

  prepNewPointChart(): IPointChart {
    return {
      isUpdated$: new Subject(),
      points: [] as IPointChartData[],
    } as IPointChart;
  }

  prepPairs(rate: ICoinApiExchangeRate): void {
    const coinPairFound = this.coinPairs.find(
      (f) =>
        f.asset_id_base === rate.asset_id_base &&
        f.asset_id_quote === rate.asset_id_quote
    );
    if (coinPairFound) {
      /**
       * update pointChartInfo
       *
       */
      this.updatePointChart(rate, coinPairFound.pointChart);

      const rates = [...coinPairFound.rates];
      rates.unshift(rate);
      coinPairFound.rates = [...rates];
    } else {
      this.coinPairId++;

      let pair = {
        asset_id_base: rate.asset_id_base,
        asset_id_quote: rate.asset_id_quote,
        id: this.coinPairId,
        name: `${rate.asset_id_base} - ${rate.asset_id_quote}`,
        pointChart: this.prepNewPointChart(),
        rates: [rate],
      } as ICoinApiExchangeRatePair;

      this.updatePointChart(rate, pair.pointChart);

      this.rxjsWebsocketService.assignIcon(pair);

      this.coinPairs.push(pair);
      this.coinPairAdded$.next(true);
    }
  }

  prepRatePairAvailableOptions(): void {
    this.ratePairOptions = this.coinPairs.map((pair) => ({
      key: pair.name,
      value: pair.id,
    }));
  }

  ratesSelected(ev: IChartConfig) {
    console.log('rates selected: ', ev);

    this.selectedCharts = this.coinPairs
      .filter(
        (f) =>
          f.id ===
          ev.pointCharts
            .map((m) => m.chartSelected.value)
            .find((id) => id === f.id)
      )
      .map(
        (pair: ICoinApiExchangeRatePair, idx: number) =>
          ({
            chart: pair,
            size: ev.pointCharts[idx].width,
          } as IChartsSelected)
      );
  }

  setIdAndTrendToPointChartData(
    point: IPointChartData,
    prevPoint?: IPointChartData
  ): void {
    if (!prevPoint) {
      point.id = 0;
      point.color = 'white';
      return;
    }
    point.id = prevPoint.id + 1;
    if (prevPoint.y === point.y) {
      point.color = 'white';
    } else {
      point.color = prevPoint && prevPoint.y < point.y ? 'green' : 'red';
    }
  }

  stop(): void {
    this.stopStream$.next(true);
  }

  test(): void {
    console.log(this.coinPairs);
  }

  updatePointChart(
    rate: ICoinApiExchangeRate,
    lastPointChart: IPointChart
  ): void {
    const rateX = new Date(rate.time).getTime();
    const rateY = rate.rate;
    /**
     * prev is FIRST element on the array
     * items are unshift - newest are at the TOP
     *
     */
    const prevPoint = lastPointChart.points ? lastPointChart.points[0] : null;
    let point = this.convertExchangeRateToPointChartData(rate);

    this.setIdAndTrendToPointChartData(point, prevPoint!);

    lastPointChart.points.unshift(point);
    lastPointChart.points = lastPointChart.points.slice(0, this.maxPointsCount);

    /**
     * until number of points is less then maxPointsCount$ (points to render)
     * check if new point is greater then stored max value
     * or less then stored min value
     * else
     * every time check min/max values
     *
     */

    if (lastPointChart.points.length < this.maxPointsCount) {
      lastPointChart.axisXMax =
        lastPointChart.axisXMax > rateX ? lastPointChart.axisXMax : rateX;
      lastPointChart.axisXMin =
        lastPointChart.axisXMin < rateX ? lastPointChart.axisXMin : rateX;
      lastPointChart.axisYMax =
        lastPointChart.axisYMax > rateY ? lastPointChart.axisYMax : rateY;
      lastPointChart.axisYMin =
        lastPointChart.axisYMin < rateY ? lastPointChart.axisYMin : rateY;
    } else {
      const pointsX = lastPointChart.points.map((m) => m.x) as number[];
      lastPointChart.axisXMax = Math.max(...pointsX);
      lastPointChart.axisXMin = Math.min(...pointsX);

      const pointsY = lastPointChart.points.map((m) => m.y);
      lastPointChart.axisYMax = Math.max(...pointsY);
      lastPointChart.axisYMin = Math.min(...pointsY);
    }

    lastPointChart.diffX = lastPointChart.axisXMax - lastPointChart.axisXMin;
    lastPointChart.diffY = lastPointChart.axisYMax - lastPointChart.axisYMin;

    lastPointChart.isUpdated$.next(true);
  }
}
