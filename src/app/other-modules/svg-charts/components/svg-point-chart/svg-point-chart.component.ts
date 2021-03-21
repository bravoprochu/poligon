import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPointChartData } from 'otherModules/svg-charts/interfaces/i-point-chart-data';
import { IPointChart } from 'otherModules/svg-charts/interfaces/i-point-chart';
import { IPointChartDataOutput } from 'otherModules/svg-charts/interfaces/i-point-chart-data-output';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-svg-point-chart',
  templateUrl: './svg-point-chart.component.svg',
  styleUrls: ['./svg-point-chart.component.scss'],
  animations: [],
})
export class SvgPointChartComponent implements OnInit {
  @Input('pointChart') pointChart = {} as IPointChart;
  @Output()
  pointSelected = new EventEmitter() as EventEmitter<IPointChartDataOutput>;
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
  points = [] as IPointChartData[];

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
    this.pointChart.isUpdated$
      .pipe(startWith(true), takeUntil(this.isDestroyed$))
      .subscribe(
        (pointChart: boolean) => {
          this.calcRatios();

          this.points = [];
          this.points = this.pointChart.points.map(
            (point) =>
              ({
                color: point.color,
                id: point.id,
                x: this.getOffsetX(point.x),
                y: this.getOffsetY(point.y),
              } as IPointChartData)
          );

          // console.log('svg', this.pointChart);
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
        ? this.chartDataYSize / this.pointChart.diffY
        : 1;
    this.chartDataXToDiffXRatio =
      this.pointChart.diffX > 0
        ? this.chartDataXSize / this.pointChart.diffX
        : 1;
  }

  checkTimeDifference(dateMin: Date, dateMax: Date): number {
    return dateMax.getTime() - dateMin.getTime();
  }

  mouseOver(event: MouseEvent, point: IPointChartData) {
    this.pointSelected.emit({
      event,
      id: this.points.indexOf(point),
    } as IPointChartDataOutput);
  }

  mouseLeave(ev: MouseEvent) {
    /**
     * return negative id
     *
     */
    this.pointSelected.emit({ event: ev, id: -1 });
  }

  getOffsetY(posY: number): number {
    /**
     * reverse value
     * absolute negative value
     */
    return (
      this.chartHeaderHeight +
      Math.abs((posY - this.pointChart.axisYMax) * this.chartDataYToDiffYRatio)
    );
  }

  getOffsetX(posX: number): number {
    return (
      this.chartLeftPanel +
      (posX - this.pointChart.axisXMin) * this.chartDataXToDiffXRatio
    );
  }
}
