import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICoinApiExchangeRate } from 'otherModules/coin-api/interfaces/i-coin-api-exchange-rate';
import { ICoinApiExchangeRatePair } from 'otherModules/coin-api/interfaces/i-coin-api-exchange-rate-pair';
import { RxjsWebsocketService } from 'otherModules/coin-api/services/rxjs-websocket.service';
import { IPointChart } from 'otherModules/svg-charts/interfaces/i-point-chart';
import { IPointChartData } from 'otherModules/svg-charts/interfaces/i-point-chart-data';
import { IPointChartDataOutput } from 'otherModules/svg-charts/interfaces/i-point-chart-data-output';
import { merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BP_ANIM_APPEAR_UP_DOWN } from 'src/app/animations/bp-anim-appear-up-down';

@Component({
  selector: 'app-rxjs-websockets',
  templateUrl: './rxjs-websockets.component.html',
  styleUrls: ['./rxjs-websockets.component.scss'],
  animations: [BP_ANIM_APPEAR_UP_DOWN(350)],
})
export class RxjsWebsocketsComponent implements OnInit {
  data2 = {} as IPointChart;
  payloadData = [] as any[];
  isDestroyed$ = new Subject() as Subject<boolean>;
  isSelected = false;
  itemHeight = 20;
  itemOnView = 10;

  coinPairId = 0;
  coinPairs = [] as ICoinApiExchangeRatePair[];

  lastPointChart = null as IPointChart | null;
  lastRate = null as ICoinApiExchangeRate | null;

  maxPointsCount$ = new FormControl(10);
  maxPointsCount = 10;

  selected = {} as ICoinApiExchangeRate;
  selectedPosition = {};

  pairIndex = 0;
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

  convertExchangeRateToPointChartData(
    rate: ICoinApiExchangeRate
  ): IPointChartData {
    return {
      x: new Date(rate.time).getTime(),
      y: rate.rate,
    } as IPointChartData;
  }

  indexNext(): void {
    if (this.pairIndex < this.coinPairs.length) {
      this.pairIndex++;
    } else {
      this.pairIndex = this.coinPairs.length - 1;
    }
  }

  indexPrev(): void {
    if (this.pairIndex > 0) {
      this.pairIndex--;
    } else {
      this.pairIndex = 0;
    }
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
          console.log('maxPointsCount subs:', maxPointsCount);
          if (!isNaN(maxPointsCount) && maxPointsCount > 4) {
            console.log('ok, change maxpointCount');
            this.maxPointsCount = maxPointsCount;
          }
        },
        (error) => console.log('maxPointsCount error', error),
        () => console.log('maxPointsCount completed..')
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

  pointSelected(ev: IPointChartDataOutput): void {
    if (ev.id < 0) {
      this.isSelected = false;
      return;
    }

    // const RATES_PAIR_MOCKED_DATA = this.rxjsWebsocketService.getExchangeRatePairMocked();
    const SELECTED_PAIR = this.coinPairs[this.pairIndex];
    const RATES = SELECTED_PAIR.rates.slice(0, this.maxPointsCount);

    this.selectedPosition = {
      left: `${ev.event.offsetX}px`,
      top: `${ev.event.offsetY - 50}px`,
    };

    const rate = RATES[ev.id];
    this.selected = { ...rate };
    this.isSelected = true;
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
    }
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
}
