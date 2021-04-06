import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of, Subject } from 'rxjs';
import { BP_ANIM_APPEAR_UP_DOWN } from 'src/app/animations/bp-anim-appear-up-down';
import { IChartSelected } from 'otherModules/svg-charts/interfaces/i-chart-selected';
import { IPointChartDataOutput } from 'otherModules/svg-charts/interfaces/i-point-chart-data-output';
import { FormControl } from '@angular/forms';
import { map, repeat, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { IChartSelectedRatePair } from 'otherModules/coin-api/interfaces/i-chart-selected-rate-pair';
import { CoinApiRatePairService } from 'otherModules/coin-api/services/coin-api-rate-pair.service';
import { ICoinApiExchangeRate } from 'otherModules/coin-api/interfaces/i-coin-api-exchange-rate';

import { BreakpointObserver } from '@angular/cdk/layout';
import { IS_XSMALL } from 'commonFunctions/breakpointObserver/is-xsmall';

@Component({
  selector: 'app-exchange-rate-chart',
  templateUrl: './exchange-rate-chart.component.html',
  styleUrls: ['./exchange-rate-chart.component.scss'],
  animations: [BP_ANIM_APPEAR_UP_DOWN(350)],
})
export class ExchangeRateChartComponent implements OnInit {
  @Input('selectedChart') selectedChart?: IChartSelectedRatePair;
  @Output('chartConfigChange')
  chartConfigChange = new EventEmitter() as EventEmitter<IChartSelected>;
  isDestroyed$ = new Subject() as Subject<boolean>;
  isSelected = false;
  isPlaying = true;
  itemHeight = 20;
  itemOnView = 10;
  isXsmall$ = IS_XSMALL(this.breakpointObs);

  configShowHistory$ = new FormControl(true);
  configWidth$ = new FormControl(100);
  configPointsCount$ = new FormControl(20);

  pointChartForceUpdate$ = new Subject() as Subject<boolean>;

  ratePairHistory = [] as ICoinApiExchangeRate[];

  constructor(
    private breakpointObs: BreakpointObserver,
    private ratePairService: CoinApiRatePairService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initObservables();
  }

  initObservables(): void {
    const RATE_PAIR_ADDED = this.ratePairService.ratePairAdded$?.pipe(
      takeWhile(() => this.isPlaying),
      map((id: number) => {
        /**
         * check if rate is added to selectedPair
         *
         */
        return id === this.selectedChart?.ratePairId ? id : null;
      }),
      takeUntil(this.isDestroyed$)
    );

    of('')
      .pipe(
        switchMap(() => RATE_PAIR_ADDED),
        repeat(),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(
        (ratePairAdded: number | null) => {
          if (ratePairAdded) {
            /**
             * update chart - points
             *
             */
            const UPDATED_POINT_CHART = this.ratePairService.getPointChartByRatePairId(
              this.selectedChart?.ratePairId!,
              this.selectedChart?.pointsCount
            );

            if (UPDATED_POINT_CHART) {
              this.selectedChart!.chart = UPDATED_POINT_CHART;
              this.pointChartForceUpdate$.next(true);
            }

            /**
             * update rates data
             *
             */
            this.ratePairHistory = this.ratePairService.getRatePairHistoryByRatePairId(
              this.selectedChart!.ratePairId!
            );
          }
        },
        (error) => console.log('ratePairAdded error', error),
        () => console.log('ratePairAdded completed..')
      );

    /**
     * chart config points on chart and fxFlex width
     *
     */
    this.configWidth$.valueChanges
      .pipe(
        map((val: number) => {
          if (val && val >= 10) {
            this.selectedChart!.width = val;
            return val;
          } else {
            return null;
          }
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(
        (configWidthChanged: any) => {},
        (error) => console.log('configWidthChanged error', error),
        () => console.log('configWidthChanged completed..')
      );

    this.configPointsCount$.valueChanges
      .pipe(
        map((val: number) => {
          if (val && val >= 5) {
            this.selectedChart!.pointsCount = val;
            return val;
          } else {
            return null;
          }
        })
      )
      .subscribe(
        (pointsCountChanged: number | null) => {
          if (pointsCountChanged) {
            this.selectedChart!.chart = this.ratePairService.getPointChartByRatePairId(
              this.selectedChart?.ratePairId!,
              pointsCountChanged
            )!;
          }
        },
        (error) => console.log('pointsCountChanged error', error),
        () => console.log('pointsCountChanged completed..')
      );
  }

  pointSelected(ev: IPointChartDataOutput): void {
    /**
     * points IDs are NOT 0 based, increment started with 1...
     *
     */
    if (ev.id < 1) {
      this.isSelected = false;
      return;
    }

    const CARD_INFO = this.ratePairService.getSvgChartInfoCard(
      ev.id,
      this.ratePairHistory
    );

    if (!CARD_INFO) {
      this.isSelected = false;
      return;
    }
    this.selectedChart!.chart.infoCard = CARD_INFO;
    this.isSelected = true;
  }

  test(): void {
    // console.log(this.chartPoints);
  }
}
