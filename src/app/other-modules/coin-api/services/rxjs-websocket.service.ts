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
import { map } from 'rxjs/operators';
import { IKeyValue } from '../interfaces/i-key-value';
import { FORM_CONTROL_HAS_KEY_VALIDATOR } from 'commonFunctions/form-validators/form-control-has-key-validator';

@Injectable({
  providedIn: 'root',
})
export class RxjsWebsocketService {
  private coinAPIwebsoecketURl = environment.coinApiIoWebsocketUrl;
  private serviceTitle = 'rxjs coinapi websocket';

  messagesType = ['trade', 'quote', 'book'] as string[];

  ws$ = webSocket({
    url: this.coinAPIwebsoecketURl,
    openObserver: {
      next: () => {
        console.log(`${this.serviceTitle} started !`);
      },
    },
    closeObserver: {
      next: (closeEvent) => {
        console.log(`${this.serviceTitle} CLOSE ev:`, closeEvent);
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

  getExchangeRate(): void {
    const exchangeRate = {
      apikey: environment.coinApiIoKey,
      heartbeat: false,
      subscribe_data_type: ['exrate'],
      subscribe_filter_asset_id: ['BTC', 'USD'] as string[],
    } as ICoinApiWebsocketHello;

    this.ws$.next(exchangeRate);
  }

  getExchangeRatePairMocked(): ICoinApiExchangeRatePair[] {
    return [];
    //return [...COIN_API_EXCHANGE_RATE_PAIR_MOCKED];
  }

  getChartsForm$(fb: FormBuilder): FormGroup {
    return fb.group({
      pointCharts: fb.array([this.getChartSelectedForm$(fb)]),
    }) as FormGroup;
  }

  getChartSelectedForm$(fb: FormBuilder): FormGroup {
    return fb.group({
      chartSelected: new FormControl(
        '',
        FORM_CONTROL_HAS_KEY_VALIDATOR('value')
      ),
      width: [100, Validators.required],
      pointsCount: [20, Validators.required],
    });
  }

  removeChartAt(id: number) {}
}
