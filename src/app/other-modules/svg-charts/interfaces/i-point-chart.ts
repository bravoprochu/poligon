import { Subject } from 'rxjs';
import { IPointChartData } from './i-point-chart-data';
import { ISvgChartInfoCard } from './i-svg-chart-info-card';

export interface IPointChart {
  axisYMax: number;
  axisYMin: number;
  axisXMax: number;
  axisXMin: number;
  diffX: number;
  diffY: number;
  infoCard: ISvgChartInfoCard;
  isUpdated$: Subject<boolean>;
  points: IPointChartData[];
}
