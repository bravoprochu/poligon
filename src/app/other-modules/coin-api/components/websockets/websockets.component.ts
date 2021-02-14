import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
    private colorRangeService: ColorRangeService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
    this.close();
  }

  isDestroyed$: Subject<boolean> = new Subject();
  isConnected = false;
  isGettingTrades = false;
  isTradeExpanded = false;
  colorGrade$: FormControl = new FormControl();
  colorGradeMaxValue$: FormControl = new FormControl(2000);
  colorGradeMinValue$: FormControl = new FormControl(0);

  trades: ICoinApiTradesLatest[] = [];

  ngOnInit(): void {
    this.coinApiService.wsInit();
    this.initObservable();
    this.initTradeExpanded();
  }

  close() {
    this.coinApiService.wsClose();
    this.isGettingTrades = false;
  }

  initObservable() {
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
          console.log('isConnected subs:', isConnected);
          this.isConnected = isConnected;
        },
        (error) => console.log('isConnected error', error),
        () => console.log('isConnected completed..')
      );
  }

  initTrades() {
    this.coinApiService.wsInitQuotes();
    this.isGettingTrades = false;
  }
  initTradeExpanded() {
    setInterval(() => {
      this.isTradeExpanded = true;
    }, 3000);
  }

  open() {
    this.coinApiService.wsInit();
  }

  setBgColor(price: number): string {
    return this.colorRangeService.getColorByValue(price, 'green');
  }
}
