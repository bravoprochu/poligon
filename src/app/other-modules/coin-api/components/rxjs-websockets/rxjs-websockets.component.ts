import { Component, OnInit } from '@angular/core';
import { ICoinApiExchangeRate } from 'otherModules/coin-api/interfaces/i-coin-api-exchange-rate';
import { ICoinApiExchangeRatePair } from 'otherModules/coin-api/interfaces/i-coin-api-exchange-rate-pair';
import { RxjsWebsocketService } from 'otherModules/coin-api/services/rxjs-websocket.service';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs-websockets',
  templateUrl: './rxjs-websockets.component.html',
  styleUrls: ['./rxjs-websockets.component.scss'],
})
export class RxjsWebsocketsComponent implements OnInit {
  payloadData = [] as any[];
  isDestroyed$ = new Subject() as Subject<boolean>;
  itemHeight = 20;
  itemOnView = 10;

  coinPairId = 0;
  coinPairs = [] as ICoinApiExchangeRatePair[];
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
    // this.coinPairs = this.rxjsWebsocketService.getExchangeRatePairMocked();
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

  prepPairs(rate: ICoinApiExchangeRate): void {
    const coinPairFound = this.coinPairs.find(
      (f) =>
        f.asset_id_base === rate.asset_id_base &&
        f.asset_id_quote === rate.asset_id_quote
    );
    if (coinPairFound) {
      const tempRates = [...coinPairFound.rates];
      tempRates.unshift(rate);
      coinPairFound.rates = [...tempRates];
    } else {
      this.coinPairId++;

      const pair = {
        asset_id_base: rate.asset_id_base,
        asset_id_quote: rate.asset_id_quote,
        id: this.coinPairId,
        name: `${rate.asset_id_base} - ${rate.asset_id_quote}`,
        rates: [rate],
      } as ICoinApiExchangeRatePair;

      this.rxjsWebsocketService.assignIcon(pair);
      this.coinPairs.push(pair);
    }
  }

  stop(): void {
    this.stopStream$.next(true);
  }

  test(): void {
    console.log(this.coinPairs);
  }
}
