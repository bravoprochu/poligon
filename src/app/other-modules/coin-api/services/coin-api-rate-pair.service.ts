import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { webSocket, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { ICoinApiWebsocketHello } from '../interfaces/i-coin-api-websocket-hello';
import { ICoinApiExchangeRatePair } from '../interfaces/i-coin-api-exchange-rate-pair';
import { COIN_API_ASSETS_ICONS } from '../data/coin-api-assets_icons';
import { COIN_API_EXCHANGE_RATE_PAIR_MOCKED } from '../data/coin-api-exchange-rate-pair-mocked';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FORM_CONTROL_HAS_KEY_VALIDATOR } from 'commonFunctions/form-validators/form-control-has-key-validator';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ICoinApiExchangeRate } from '../interfaces/i-coin-api-exchange-rate';
import { IPointChart } from 'otherModules/svg-charts/interfaces/i-point-chart';
import { IPointChartData } from 'otherModules/svg-charts/interfaces/i-point-chart-data';

@Injectable({
  providedIn: 'root',
})
export class CoinApiRatePairService {
  coinPairs = [] as ICoinApiExchangeRatePair[];
  coinPairs$ = new Subject() as Subject<ICoinApiExchangeRatePair[]>;
  coinPairAdded$ = new Subject() as Subject<boolean>;

  private coinAPIwebsoecketURl = environment.coinApiIoWebsocketUrl;
  private coinPairId = 0;
  private serviceTitle = 'rxjs coinapi coin pair websocket';

  isConnected$ = new Subject() as Subject<boolean>;

  messagesType = ['trade', 'quote', 'book'] as string[];

  ws$ = webSocket({
    url: this.coinAPIwebsoecketURl,
    openObserver: {
      next: () => {
        console.log(`${this.serviceTitle} started !`);
        this.isConnected$.next(true);
      },
    },
    closeObserver: {
      next: (closeEvent) => {
        console.log(`${this.serviceTitle} CLOSE ev:`, closeEvent);
        this.isConnected$.next(false);
      },
    },
    closingObserver: {
      next: (event) => {
        console.log(`${this.serviceTitle} closed due to unsubscribe...`, event);
      },
    },
  });

  constructor() {}

  addPointChart(pointCharts: FormArray, fb: FormBuilder): void {
    pointCharts.push(this.getChartSelectedForm$(fb));
  }

  assignIcon(pair: ICoinApiExchangeRatePair): void {
    pair.asset_id_base_logo = COIN_API_ASSETS_ICONS.find(
      (f) => f.asset_id === pair.asset_id_base
    )?.url;
    pair.asset_id_quote_logo = COIN_API_ASSETS_ICONS.find(
      (f) => f.asset_id === pair.asset_id_quote
    )?.url;
  }

  getCoinPair$(): any {
    return this.isConnected$.pipe(
      switchMap((isConnected: boolean) => {
        if (isConnected) {
          return of('ok !');
        } else {
          return this.getIfNotConnected()
            .pipe
            // switchMap(())
            ();
        }
      })
    );
  }

  getIfConnected(): Observable<any> {
    return this.ws$.pipe(tap((data) => console.log('ws inside service', data)));
  }

  getIfNotConnected(): Observable<any> {
    const exchangeRate = {
      apikey: environment.coinApiIoKey,
      heartbeat: false,
      subscribe_data_type: ['exrate'],
      subscribe_filter_asset_id: ['BTC', 'USD'] as string[],
    } as ICoinApiWebsocketHello;

    this.ws$.next(exchangeRate);
    return this.ws$.pipe(
      tap((pair) => this.prepPairs(pair as ICoinApiExchangeRate)),
      switchMap((val) => this.coinPairs$)
    );
  }

  getExchangeRate(): void {
    const exchangeRate = {
      apikey: environment.coinApiIoKey,
      heartbeat: false,
      subscribe_data_type: ['exrate'],
      subscribe_filter_asset_id: ['BTC', 'USD'] as string[],
    } as ICoinApiWebsocketHello;

    this.ws$.pipe(tap((data) => console.log('ws inside service', data)));
    this.ws$.next(exchangeRate);
  }

  getExchangeRatePairMocked(): ICoinApiExchangeRatePair[] {
    return [];
    //return [...COIN_API_EXCHANGE_RATE_PAIR_MOCKED];
  }

  getChartsForm$(fb: FormBuilder): FormGroup {
    return fb.group({
      chartsSelected: fb.array([this.getChartSelectedForm$(fb)]),
    }) as FormGroup;
  }

  getChartSelectedForm$(fb: FormBuilder): FormGroup {
    return fb.group({
      chartSelected: new FormControl(
        '',
        FORM_CONTROL_HAS_KEY_VALIDATOR('value')
      ),
      pointsCount: [20, Validators.required],
      width: [100, Validators.required],
    });
  }

  removeChartAt(id: number) {}

  private convertExchangeRateToPointChartData(
    rate: ICoinApiExchangeRate
  ): IPointChartData {
    return {
      x: new Date(rate.time).getTime(),
      y: rate.rate,
    } as IPointChartData;
  }

  private prepNewPointChart(): IPointChart {
    return {
      isUpdated$: new Subject(),
      points: [] as IPointChartData[],
    } as IPointChart;
  }

  private prepPairs(rate: ICoinApiExchangeRate): void {
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
      this.assignIcon(pair);

      this.coinPairs.push(pair);
      this.coinPairAdded$.next(true);
    }
  }

  private setIdAndTrendToPointChartData(
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

  private updatePointChart(
    rate: ICoinApiExchangeRate,
    lastPointChart: IPointChart,
    maxPointsCount: number = 10
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
    // lastPointChart.points = lastPointChart.points.slice(0, this.maxPointsCount);

    /**
     * until number of points is less then maxPointsCount$ (points to render)
     * check if new point is greater then stored max value
     * or less then stored min value
     * else
     * every time check min/max values
     *
     */

    if (lastPointChart.points.length < maxPointsCount) {
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
