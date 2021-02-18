import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { delay, startWith, takeUntil, tap } from 'rxjs/operators';
import { IS_HANDSET } from 'src/app/common-functions/is-handset';
import { ColorRangeService } from 'src/app/other-modules/color-range/services/color-range.service';
import { ICoinApiTradesLatest } from '../../interfaces/i-coin-api-trades-latest';
import { CoinApiService } from '../../services/coin-api.service';

@Component({
  selector: 'app-websockets',
  templateUrl: './websockets.component.html',
  styleUrls: ['./websockets.component.scss'],
})
export class WebsocketsComponent implements OnInit, OnDestroy {
  @ViewChild('colorInput') colorInput!: ElementRef;
  constructor(
    public coinApiService: CoinApiService,
    private breakpointObserver: BreakpointObserver,
    private colorRangeService: ColorRangeService
  ) {}

  isDestroyed$: Subject<boolean> = new Subject();
  isConnected = false;
  isColorExpanded = false;
  isGettingTrades = false;
  isHandset$ = IS_HANDSET(this.breakpointObserver);
  isTradeExpanded = false;
  colorGrade$: FormControl = new FormControl();
  colorGradeMaxValue$: FormControl = new FormControl(2000);
  colorGradeMinValue$: FormControl = new FormControl(0);

  trades: ICoinApiTradesLatest[] = [];

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
    this.close();
  }

  ngOnInit(): void {
    this.coinApiService.wsInit();
    this.initObservable();
    this.initTradeExpanded();
  }

  close(): void {
    this.coinApiService.wsClose();
    this.isGettingTrades = false;
  }

  initObservable(): void {
    this.coinApiService.coinApiIoWebsocketPayload$
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe(
        (trade: ICoinApiTradesLatest) => {
          this.trades.unshift(trade);
          this.trades = [...this.trades];
        },
        (error) => console.log('trades error', error),
        () => console.log('trades completed..')
      );

    this.coinApiService.isWebsocketConnected$
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe(
        (isConnected: any) => {
          this.isConnected = isConnected;
        },
        (error) => console.log('isConnected error', error),
        () => console.log('isConnected completed..')
      );
  }

  initTrades(): void {
    this.coinApiService.wsInitTrades();
    this.isGettingTrades = false;
  }
  initTradeExpanded(): void {
    of()
      .pipe(
        startWith(null),
        delay(1500),
        tap(() => (this.isTradeExpanded = true)),
        delay(1500),
        tap(() => {
          this.initTrades();
          this.isGettingTrades = true;
        }),
        delay(2500),
        tap(() => (this.isColorExpanded = true)),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(
        (dataFlow: any) => {
          console.log('dataFlow subs:', dataFlow);
        },
        (error) => console.log('dataFlow error', error),
        () => console.log('dataFlow completed..')
      );
  }

  open() {
    this.coinApiService.wsInit();
  }

  setBgColor(price: number): string {
    return this.colorRangeService.getColorByValue(price, 'white');
  }
}
