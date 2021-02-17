import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ICoinApiExchanges } from '../interfaces/i-coin-api-exchanges';
import { ICoinApiOrderBook } from '../interfaces/i-coin-api-order-book';
import { ICoinApiQuotesCurrent } from '../interfaces/i-coin-api-quotes-current';
import { ICoinApiTradesLatest } from '../interfaces/i-coin-api-trades-latest';
import { ICoinApiWebsocketHello } from '../interfaces/i-coin-api-websocket-hello';

@Injectable({
  providedIn: 'root',
})
export class CoinApiService {
  constructor(private httpClient: HttpClient) {}

  private coinApiIoUrl: string =
    environment.coinApiIoUrl || 'https://rest.coinapi.io/';
  private coinApiAssetsUrl = '../../../../assets/mocked-data/coin-api/';
  private coinApiIoWebsocketUrl: string =
    environment.coinApiIoWebsocketUrl || 'wss://ws-sandbox.coinapi.io/v1/';
  private coinApiIoKey: string =
    environment.coinApiIoKey || 'CB32E10F-F1F4-44B8-889D-0EE0ABBF6959';
  private coinApiHeader: HttpHeaders = new HttpHeaders().append(
    'X-CoinAPI-Key',
    this.coinApiIoKey
  );
  private coinApiUrlExchanges = 'v1/exchanges';
  private coinApiUrlOrderBooks = 'v1/orderbooks/current';
  private coinApiUrlQuotes = 'v1/quotes/current';
  private coinApiUrlTrades = 'v1/trades/latest';
  isWebsocketConnected$: Subject<boolean> = new Subject();
  private coinApiWebsocketConnection = {} as WebSocket;
  coinApiIoWebsocketPayload$: Subject<any> = new Subject();

  getExchanges$(): Observable<ICoinApiExchanges[]> {
    return this.httpClient
      .get<ICoinApiExchanges[]>(this.coinApiIoUrl + this.coinApiUrlExchanges, {
        headers: this.coinApiHeader,
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  getExchangesMocked$(): Observable<ICoinApiExchanges[]> {
    const exchanges = 'exchanges.json';
    return this.httpClient
      .get<ICoinApiExchanges[]>(this.coinApiAssetsUrl + exchanges)
      .pipe(
        delay(750),
        catchError((err) => {
          return of(err);
        })
      );
  }

  getOrderBook$(): Observable<ICoinApiOrderBook[]> {
    return this.httpClient
      .get<ICoinApiOrderBook[]>(this.coinApiIoUrl + this.coinApiUrlOrderBooks, {
        headers: this.coinApiHeader,
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  getOrderBookMocked$(): Observable<ICoinApiOrderBook[]> {
    const orderBook = 'orderBook.json';
    return this.httpClient
      .get<ICoinApiOrderBook[]>(this.coinApiAssetsUrl + orderBook)
      .pipe(
        delay(750),
        catchError((err) => {
          return of(err);
        })
      );
  }

  getQuotes$(): Observable<ICoinApiQuotesCurrent[]> {
    return this.httpClient
      .get<ICoinApiQuotesCurrent[]>(this.coinApiIoUrl + this.coinApiUrlQuotes, {
        headers: this.coinApiHeader,
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  getQuotesMocked$(): Observable<ICoinApiQuotesCurrent[]> {
    const quotes = 'quotes.json';
    return this.httpClient
      .get<ICoinApiQuotesCurrent[]>(this.coinApiAssetsUrl + quotes)
      .pipe(
        delay(750),
        catchError((err) => {
          return of(err);
        })
      );
  }

  getTrades$(): Observable<ICoinApiTradesLatest[]> {
    return this.httpClient
      .get<ICoinApiTradesLatest[]>(this.coinApiIoUrl + this.coinApiUrlTrades, {
        headers: this.coinApiHeader,
      })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  getTradesMocked$(): Observable<ICoinApiTradesLatest[]> {
    const trades = 'trades.json';
    return this.httpClient
      .get<ICoinApiTradesLatest[]>(this.coinApiAssetsUrl + trades)
      .pipe(
        delay(750),
        catchError((err) => {
          return of(err);
        })
      );
  }

  wsInit(): void {
    this.coinApiWebsocketConnection = new WebSocket(this.coinApiIoWebsocketUrl);
    this.isWebsocketConnected$.next(true);
    this.coinApiWebsocketConnection.onclose = (ev) => {
      return this.wsOnClose(ev);
    };
    this.coinApiWebsocketConnection.onerror = (ev) => {
      console.log('error', ev);
    };
    this.coinApiWebsocketConnection.onopen = (ev) => {
      return this.wsOnOpen(ev);
    };
    this.coinApiWebsocketConnection.onmessage = (ev) => {
      this.wsOnMessage(ev);
    };
  }

  wsClose(): void {
    this.coinApiWebsocketConnection!.close();
  }

  wsInitTrades(): void {
    const quotesReq = {
      apikey: this.coinApiIoKey,
      heartbeat: false,
      subscribe_data_type: ['trade'],
      subscribe_filter_symbol_id: ['COINBASE_'] as string[],
    } as ICoinApiWebsocketHello;

    this.wsSend(quotesReq);
  }

  wsOnMessage(ev: MessageEvent): void {
    this.coinApiIoWebsocketPayload$.next(JSON.parse(ev.data));
  }

  wsOnOpen(ev: any): void {
    this.isWebsocketConnected$.next(true);
  }

  wsOnClose(ev: any): void {
    this.isWebsocketConnected$.next(false);
  }

  wsSend(dataToSend: ICoinApiWebsocketHello): void {
    this.coinApiWebsocketConnection.send(JSON.stringify(dataToSend));
  }
}
