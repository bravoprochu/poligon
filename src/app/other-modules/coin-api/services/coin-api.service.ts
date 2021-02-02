import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ICoinApiExchanges } from '../exchanges/interfaces/i-coin-api-exchanges';
import { COIN_API_EXCHANGES } from '../mock-data/coin-api-exchange';
import { COIN_API_QUOUTES_CURRENT } from '../mock-data/coin-api-quotes-current';
import { COIN_API_TRADES_LATEST } from '../mock-data/coin-api-trades-latest';
import { ICoinApiQuotesCurrent } from '../quotes/interfaces/i-coin-api-quotes-current';
import { ICoinApiTradesLatest } from '../trades/interfaces/i-coin-api-trades-latest';

@Injectable({
  providedIn: 'root',
})
export class CoinApiService {
  constructor(private httpClient: HttpClient) {}

  private coinApiIoUrl: string =
    environment.coinApiIoUrl || 'https://rest.coinapi.io/';
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

  mockedExchangeData$: Subject<any> = new Subject();

  getExchanges$(): Observable<ICoinApiExchanges[]> {
    return this.httpClient
      .get<ICoinApiExchanges[]>(this.coinApiIoUrl + this.coinApiUrlExchanges, {
        headers: this.coinApiHeader,
      })
      .pipe();
  }

  getExchangesMocked$(): Observable<ICoinApiExchanges[]> {
    return of(COIN_API_EXCHANGES).pipe(delay(850));
  }

  getQuotes$(): Observable<ICoinApiQuotesCurrent[]> {
    return this.httpClient.get<ICoinApiQuotesCurrent[]>(
      this.coinApiIoUrl + this.coinApiUrlQuotes,
      {
        headers: this.coinApiHeader,
      }
    );
  }

  getQuotesMocked$(): Observable<ICoinApiQuotesCurrent[]> {
    return of(COIN_API_QUOUTES_CURRENT).pipe(delay(540));
  }

  getTrades$(): Observable<ICoinApiTradesLatest[]> {
    return this.httpClient.get<ICoinApiTradesLatest[]>(
      this.coinApiIoUrl + this.coinApiUrlTrades,
      {
        headers: this.coinApiHeader,
      }
    );
  }

  getTradesMocked$(): Observable<ICoinApiTradesLatest[]> {
    return of(COIN_API_TRADES_LATEST).pipe(delay(650));
  }
}
