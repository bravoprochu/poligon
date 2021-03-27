import { Component, OnInit } from '@angular/core';
import { IChartConfigPanel } from 'otherModules/coin-api/interfaces/i-charts-config-panel';
import { ICoinApiExchangeRate } from 'otherModules/coin-api/interfaces/i-coin-api-exchange-rate';

import { IKeyValue } from 'otherModules/coin-api/interfaces/i-key-value';
import { CoinApiRatePairService } from 'otherModules/coin-api/services/coin-api-rate-pair.service';
import { IPointChart } from 'otherModules/svg-charts/interfaces/i-point-chart';

import { ISvgChartInfoCard } from 'otherModules/svg-charts/interfaces/i-svg-chart-info-card';
import { Subject } from 'rxjs';
import { IChartSelectedRatePair } from 'otherModules/coin-api/interfaces/i-chart-selected-rate-pair';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs-websockets',
  templateUrl: './rxjs-websockets.component.html',
  styleUrls: ['./rxjs-websockets.component.scss'],
})
export class RxjsWebsocketsComponent implements OnInit {
  isDestroyed$ = new Subject() as Subject<boolean>;
  isSelected = false;

  chartsSelectedArr = [] as IChartSelectedRatePair[];

  infoCard = {} as ISvgChartInfoCard;

  lastPointChart = null as IPointChart | null;
  lastRate = null as ICoinApiExchangeRate | null;

  selectedCharts = [] as IChartSelectedRatePair[];

  ratePairOptions = [] as IKeyValue<number>[];
  stopStream$ = new Subject() as Subject<boolean>;

  constructor(
    private ratePairService: CoinApiRatePairService,
    private rxjsWebsocketService: CoinApiRatePairService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.init2();
    // this.initWebsocket();
    // this.initObservables();
    // this.coinPairs = this.rxjsWebsocketService.getExchangeRatePairMocked();
    // this.prepMockedData();
  }

  initObservables(): void {}

  init2(): void {
    this.ratePairService
      .getRatePairs$()
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe(
        (getRatePairs: any) => {
          // console.log('getRatePairs subs:', getRatePairs);
        },
        (error) => console.log('getRatePairs error', error),
        () => console.log('getRatePairs completed..')
      );
  }

  chartsSelected(ev: IChartConfigPanel) {
    const test = ev.chartsSelected;
    this.ratePairService.updateChartsSelectedArr(this.chartsSelectedArr, ev);
  }

  stop(): void {
    this.stopStream$.next(true);
  }

  test(): void {}

  // get chartsSelected(): IChartSelectedRatePair[] {
  //   return this.ratePairService.chartsSelectedRatePair;
  // }
}
