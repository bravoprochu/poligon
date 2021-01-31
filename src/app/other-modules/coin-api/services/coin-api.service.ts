import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ICoinApiExchanges } from '../interfaces/i-coin-api-exchanges';
import { COIN_API_EXCHANGES } from '../mock-data/coin-api-exchange';

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
  mockedExchangeData$: Subject<any> = new Subject();

  getExchanges$(): Observable<ICoinApiExchanges[]> {
    return of(COIN_API_EXCHANGES).pipe(delay(850));
    // return this.httpClient
    //   .get<ICoinApiExchanges[]>(this.coinApiIoUrl + this.coinApiUrlExchanges, {
    //     headers: this.coinApiHeader,
    //   })
    //   .pipe();
  }
}
