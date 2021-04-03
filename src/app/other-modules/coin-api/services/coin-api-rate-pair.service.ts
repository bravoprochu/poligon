import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { webSocket } from 'rxjs/webSocket';
import { ICoinApiWebsocketHello } from '../interfaces/i-coin-api-websocket-hello';
import { ICoinApiExchangeRatePair } from '../interfaces/i-coin-api-exchange-rate-pair';
import { COIN_API_ASSETS_ICONS } from '../data/coin-api-assets_icons';

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

import { IKeyValue } from '../interfaces/i-key-value';
import { IChartSelectedRatePair } from '../interfaces/i-chart-selected-rate-pair';
import { IChartConfigPanel } from '../interfaces/i-charts-config-panel';
import { IPointChartConfig } from '../interfaces/i-point-chart-config';
import { ISvgChartInfoCard } from 'otherModules/svg-charts/interfaces/i-svg-chart-info-card';
import { IPointChartDataOutput } from 'otherModules/svg-charts/interfaces/i-point-chart-data-output';

@Injectable({
  providedIn: 'root',
})
export class CoinApiRatePairService {
  // chartsSelectedRatePair = [] as IChartSelectedRatePair[];
  ratePairs = [] as ICoinApiExchangeRatePair[];

  /**
   * INDICATE every new ratePair added
   *
   */
  ratePairCreated$ = new Subject() as Subject<string>;

  /**
   * INDICATE every websocket rate transfer to its pair
   * number indicates pairRateId to filter incomming data on
   * subscribed components/services
   *
   */
  ratePairAdded$ = new Subject() as Subject<number>;

  private coinAPIwebsoecketURl = environment.coinApiIoWebsocketUrl;
  private ratePairId = 0;
  private serviceTitle = 'coinapi rate pair websocket';

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
      tap((pair) => this.prepRatePairs(pair as ICoinApiExchangeRate)),
      switchMap((val) => this.ratePairCreated$)
    );
  }

  /**
   * out
   *
   */
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

  getRatePairs$(): Observable<any> {
    const exchangeRate = {
      apikey: environment.coinApiIoKey,
      heartbeat: false,
      subscribe_data_type: ['exrate'],
      subscribe_filter_asset_id: ['BTC', 'USD'] as string[],
    } as ICoinApiWebsocketHello;

    this.ws$.next(exchangeRate);

    return this.ws$.pipe(
      tap((data) => {
        this.prepRatePairs(data as ICoinApiExchangeRate);
      })
    );
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

  getChartSelectedRatePairByPointChartConfig(
    chartConfig: IPointChartConfig
  ): IChartSelectedRatePair {
    const RATE_PAIR_SELECTED = this.ratePairs.find(
      (rate) => rate.ratePairId === chartConfig.chartSelected.value
    );
    const CHART = this.getPointChartByRatePairId(
      chartConfig.chartSelected.value,
      chartConfig.pointsCount
    );

    return {
      chart: CHART,
      logoBase: RATE_PAIR_SELECTED?.asset_id_base_logo,
      logoQuote: RATE_PAIR_SELECTED?.asset_id_quote_logo,
      pointsCount: chartConfig.pointsCount,
      ratePairId: RATE_PAIR_SELECTED?.ratePairId,
      title: RATE_PAIR_SELECTED?.name,
      width: chartConfig.width,
    } as IChartSelectedRatePair;
  }

  getPointChartByRatePairId(
    id: number,
    pointCounts = 20 as number
  ): IPointChart | null {
    const RATE_PAIR = this.ratePairs.find((f) => f.ratePairId === id);
    if (!RATE_PAIR) {
      return null;
    }

    const RATES = RATE_PAIR.rates;
    const LAST_RATE_ID =
      RATES.length >= pointCounts ? pointCounts : RATES.length;
    const LAST_RATE = RATES[LAST_RATE_ID];
    const RATES_RANGE = RATES.slice(0, LAST_RATE_ID);

    const POINT_CHART_DATA = RATES_RANGE.map(
      (rate: ICoinApiExchangeRate, idx: number) => {
        const IS_LAST = idx + 1 === RATES_RANGE.length ? true : false;
        const NEXT_RATE = !IS_LAST ? RATES_RANGE[idx + 1] : rate;

        const IS_INCREASING =
          !IS_LAST && NEXT_RATE.rate < rate.rate ? true : false;
        let color = 'white';
        if (!IS_LAST && NEXT_RATE.rate === rate.rate) {
          color = 'white';
        } else {
          color = IS_INCREASING ? 'green' : 'red';
        }

        return {
          color: color,
          id: rate.exchangeRateId,
          x: new Date(rate.time).getTime(),
          y: rate.rate,
        } as IPointChartData;
      }
    );

    const X_DATA = POINT_CHART_DATA.map((rate: IPointChartData) => rate.x);
    const Y_DATA = POINT_CHART_DATA.map((rate: IPointChartData) => rate.y);

    const axisXMax = Math.max(...X_DATA);
    const axisXMaxDate = new Date(axisXMax);
    const axisXMin = Math.min(...X_DATA);
    const axisXMinDate = new Date(axisXMin);
    const diffX = axisXMax - axisXMin;

    const axisXMid = new Date((axisXMin + axisXMax) / 2);

    const axisYMax = Math.max(...Y_DATA);
    const axisYMin = Math.min(...Y_DATA);

    const POINT_CHART = {
      axisXMax,
      axisXMaxCaption: `${axisXMaxDate.toLocaleDateString()} ${axisXMaxDate.toLocaleTimeString()}`,
      axisXMidCaption: `${axisXMid.toLocaleDateString()} ${axisXMid.toLocaleTimeString()}`,
      axisXMin,
      axisXMinCaption: `${axisXMinDate.toLocaleDateString()} ${axisXMinDate.toLocaleTimeString()}`,
      axisYMax,
      axisYMaxCaption: axisYMax.toString(),
      axisYMin,
      axisYMinCaption: axisYMin.toString(),
      diffX,
      diffY: axisYMax - axisYMin,
      points: POINT_CHART_DATA,
      pointsCount: LAST_RATE_ID + 1,
    } as IPointChart;

    return POINT_CHART;
  }

  getRatePairAvailableOptions(): IKeyValue<number>[] {
    return this.ratePairs.map(
      (pair: ICoinApiExchangeRatePair) =>
        ({
          key: pair.name,
          value: pair.ratePairId,
        } as IKeyValue<number>)
    );
  }

  getRatePairHistoryByRatePairId(ratePairId: number): ICoinApiExchangeRate[] {
    const RATE_PAIR = this.ratePairs.find(
      (rate) => rate.ratePairId === ratePairId
    );
    return RATE_PAIR ? [...RATE_PAIR.rates] : [];
  }

  getSvgChartInfoCard(
    id: number,
    ratesHistory: ICoinApiExchangeRate[]
  ): ISvgChartInfoCard | null {
    /**
     * points IDs are NOT 0 based, increment started with 1...
     *
     */
    const RATES = ratesHistory;
    const CURRENT_RATE = RATES.find((f) => f.exchangeRateId === id);
    if (!CURRENT_RATE) {
      return null;
    }
    const PREV_RATE =
      id > 1 ? RATES.find((f) => f.exchangeRateId === id - 1) : null;
    const RATE_CHANGE = PREV_RATE ? CURRENT_RATE.rate - PREV_RATE.rate : null;
    const CHANGE_PERCENTAGE = PREV_RATE
      ? ((RATE_CHANGE! / +CURRENT_RATE.rate) * 100).toString() + ' %'
      : '';
    const IS_INCREASING =
      PREV_RATE && CURRENT_RATE.rate >= PREV_RATE.rate ? true : false;
    const date = new Date(CURRENT_RATE.time);

    return {
      change: RATE_CHANGE && RATE_CHANGE != 0 ? RATE_CHANGE!.toString() : '',
      changePercentage: CHANGE_PERCENTAGE != '0 %' ? CHANGE_PERCENTAGE : '',
      color: IS_INCREASING ? 'green' : 'red',
      isIncreasing: IS_INCREASING,
      subtitle: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      title: CURRENT_RATE.rate.toString(),
    } as ISvgChartInfoCard;
  }

  updateChartsSelectedArr(
    chartsSelectedRatePair: IChartSelectedRatePair[],
    config: IChartConfigPanel
  ): void {
    /**
     * remove deleted charts
     *
     */
    const IDS_TO_REMOVE = [] as number[];
    chartsSelectedRatePair.map((selected, idx: number) => {
      const FOUND = config.chartsSelected.find(
        (configChart) => configChart.chartSelected.value === selected.ratePairId
      );
      if (!FOUND) {
        IDS_TO_REMOVE.push(idx);
      }
      return selected;
    });
    IDS_TO_REMOVE.forEach((id) => chartsSelectedRatePair.splice(id, 1));

    /**
     * add chart if new
     *
     */
    config.chartsSelected.forEach((chartSelected: IPointChartConfig) => {
      const SELECTED_ID = chartSelected.chartSelected.value;
      const ALREADY_ON_LIST = chartsSelectedRatePair.find(
        (f) => f.ratePairId === SELECTED_ID
      );

      if (!ALREADY_ON_LIST) {
        chartsSelectedRatePair.push(
          this.getChartSelectedRatePairByPointChartConfig(chartSelected)
        );
      }
    });
  }

  removeChartAt(id: number) {}

  private convertExchangeRateToPointChartData(
    rate: ICoinApiExchangeRate
  ): IPointChartData {
    return {
      id: rate.exchangeRateId,
      x: new Date(rate.time).getTime(),
      y: rate.rate,
    } as IPointChartData;
  }

  private prepRatePairs(rate: ICoinApiExchangeRate): void {
    /**
     * assign coinExchangeRate ID - starts with 1;
     * Used in chartPoint id, and determine next/prev point
     * based on rates history
     *
     */
    rate.exchangeRateId = 1;
    const coinPairFound = this.ratePairs.find(
      (f) =>
        f.asset_id_base === rate.asset_id_base &&
        f.asset_id_quote === rate.asset_id_quote
    );
    if (coinPairFound) {
      const rates = [...coinPairFound.rates];
      rate.exchangeRateId = rates.length + 1;
      rates.unshift(rate);

      coinPairFound.rates = [...rates];
      this.ratePairAdded$.next(coinPairFound.ratePairId);
    } else {
      this.ratePairId++;
      const pair = {
        asset_id_base: rate.asset_id_base,
        asset_id_quote: rate.asset_id_quote,
        ratePairId: this.ratePairId,
        name: `${rate.asset_id_base} - ${rate.asset_id_quote}`,
        rates: [rate],
      } as ICoinApiExchangeRatePair;

      this.assignIcon(pair);
      this.ratePairs.push(pair);

      this.ratePairCreated$.next(`id: ${pair.ratePairId}, ${pair.name}`);
      this.ratePairAdded$.next(pair.ratePairId);
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
}
