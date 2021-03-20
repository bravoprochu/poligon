import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { webSocket, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { ICoinApiWebsocketHello } from '../interfaces/i-coin-api-websocket-hello';
import { ICoinApiExchangeRatePair } from '../interfaces/i-coin-api-exchange-rate-pair';
import { COIN_API_ASSETS_ICONS } from '../data/coin-api-assets_icons';
import { COIN_API_EXCHANGE_RATE_PAIR_MOCKED } from '../data/coin-api-exchange-rate-pair-mocked';

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

  assignIcon(pair: ICoinApiExchangeRatePair): void {
    pair.asset_id_base_logo = COIN_API_ASSETS_ICONS.find(
      (f) => f.asset_id === pair.asset_id_base
    )?.url;
    pair.asset_id_quote_logo = COIN_API_ASSETS_ICONS.find(
      (f) => f.asset_id === pair.asset_id_quote
    )?.url;
  }
}
