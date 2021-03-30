import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IPointChartData } from 'otherModules/svg-charts/interfaces/i-point-chart-data';
import { IPointChart } from 'otherModules/svg-charts/interfaces/i-point-chart';
import { IPointChartDataOutput } from 'otherModules/svg-charts/interfaces/i-point-chart-data-output';
import { Subject } from 'rxjs';
import { BP_ANIM_APPEAR_UP_DOWN } from 'src/app/animations/bp-anim-appear-up-down';
import { IPointChartSelectedPointInfo } from 'otherModules/svg-charts/interfaces/i-point-chart-selected-point-info';
import { startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-svg-point-chart',
  templateUrl: './svg-point-chart.component.svg',
  styleUrls: ['./svg-point-chart.component.scss'],
  animations: [BP_ANIM_APPEAR_UP_DOWN(250, 150)],
})
export class SvgPointChartComponent implements OnInit {
  @Input('pointChart') pointChart = {} as IPointChart;
  @Input('forceUpdate$') forceUpdate$ = new Subject() as Subject<boolean>;
  @Input('selectedPoint') selectedPoint?: IPointChartSelectedPointInfo;
  @Output()
  pointSelected = new EventEmitter() as EventEmitter<IPointChartDataOutput>;
  @ViewChild('svg') svg?: ElementRef;
  chartHeaderHeight = 50;
  chartFooterHeight = 50;
  chartLeftPanel = 100;
  chartRightPanel = 200;
  chartDataXSize = 1000;
  chartDataYSize = 500;
  /**
   * default viewBox 1300 x 600 [1000 x 500 for data chart]
   *
   */
  chartViewBox = `0 0 ${
    this.chartLeftPanel + this.chartRightPanel + this.chartDataXSize
  } ${this.chartHeaderHeight + this.chartFooterHeight + this.chartDataYSize}`;

  chartDataYToDiffYRatio = 0;
  chartDataXToDiffXRatio = 0;

  data = {} as IPointChart;
  isDestroyed$ = new Subject() as Subject<boolean>;
  isSelected = false;
  points = [] as IPointChartData[];
  selectedPosition = {};

  constructor() {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initObservables();
  }

  initData(): void {}

  initObservables(): void {
    this.forceUpdate$
      .pipe(startWith(true), takeUntil(this.isDestroyed$))
      .subscribe(
        (pointChart: boolean) => {
          this.calcRatios();
          this.points = [];
          this.points = this.pointChart.points
            .slice(0, this.pointChart.pointsCount)
            .map(
              (point) =>
                ({
                  color: point.color,
                  id: point.id,
                  x: this.getOffsetX(point.x),
                  y: this.getOffsetY(point.y),
                } as IPointChartData)
            );
        },
        (error) => console.log('pointChart error', error),
        () => console.log('pointChart completed..')
      );
  }

  calcRatios(): void {
    /**
     * calc data difference to chart viewbox ratio;
     *
     */
    this.chartDataYToDiffYRatio =
      this.pointChart.diffY > 0
        ? this.chartDataYSize / +this.pointChart.diffY
        : 1;
    this.chartDataXToDiffXRatio =
      this.pointChart.diffX > 0
        ? this.chartDataXSize / +this.pointChart.diffX
        : 1;
  }

  checkTimeDifference(dateMin: Date, dateMax: Date): number {
    return dateMax.getTime() - dateMin.getTime();
  }

  mouseOver(event: MouseEvent, point: IPointChartData) {
    this.pointSelected.emit({
      id: point.id,
      event: event,
    } as IPointChartDataOutput);

    this.isSelected = true;
  }

  mouseLeave(ev: MouseEvent) {
    this.isSelected = false;
  }

  getOffsetY(posY: number): number {
    /**
     * reverse value
     * absolute negative value
     */
    return (
      this.chartHeaderHeight +
      Math.abs((posY - +this.pointChart.axisYMax) * this.chartDataYToDiffYRatio)
    );
  }

  getOffsetX(posX: number): number {
    return (
      this.chartLeftPanel +
      (posX - +this.pointChart.axisXMin) * this.chartDataXToDiffXRatio
    );
  }
}
