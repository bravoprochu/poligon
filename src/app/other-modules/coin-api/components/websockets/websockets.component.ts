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
import { ICoinApiTradesLatest } from '../../interfaces/i-coin-api-trades-latest';
import { CoinApiService } from '../../services/coin-api.service';

@Component({
  selector: 'app-websockets',
  templateUrl: './websockets.component.html',
  styleUrls: ['./websockets.component.scss'],
})
export class WebsocketsComponent implements OnInit, OnDestroy {
  @ViewChild('colorInput') colorInput!: ElementRef;
  constructor(public coinApiService: CoinApiService) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
    this.close();
  }

  colors: string[] = [];
  isDestroyed$: Subject<boolean> = new Subject();
  colorGrade$: FormControl = new FormControl();
  colorGradeMaxValue$: FormControl = new FormControl(2000);
  colorGradeMinValue$: FormControl = new FormControl(0);

  trades: ICoinApiTradesLatest[] = [];

  ngOnInit(): void {
    this.coinApiService.wsInit();
    this.initObservable();
    this.initColors();
  }

  close() {
    this.coinApiService.wsClose();
  }

  colorAdd(index: number) {
    const input = this.colorInput.nativeElement as HTMLInputElement;
    input.value = this.colors[index];

    input.click();
    input.onchange = (ev) => {
      console.log(ev, input.value);
      this.colors[index] = input.value;
    };
  }

  initColors() {
    this.colors = ['#E72DFC', '#D9279F', '#F03756', '#D95C4E', '#FC8B65'];
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
  }

  initQuotes() {
    this.coinApiService.wsInitQuotes();
  }

  open() {
    this.coinApiService.wsInit();
  }

  setBgColor(price: number): string {
    if (price >= this.colorGradeMaxValue$.value) {
      return this.colors[this.colors.length - 1];
    } else if (price <= this.colorGradeMinValue$.value) {
      return this.colors[0];
    }
    const priceRatio = price / this.colorGradeMaxValue$.value;
    const idx = Math.floor(this.colors.length * priceRatio);
    return this.colors[idx];
  }
}
