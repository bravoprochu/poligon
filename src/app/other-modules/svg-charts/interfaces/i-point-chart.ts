import { Subject } from 'rxjs';
import { IPointChartData } from './i-point-chart-data';

export interface IPointChart {
  axisYMax: number;
  axisYMin: number;
  axisXMax: number;
  axisXMin: number;
  diffX: number;
  diffY: number;
  isUpdated$: Subject<boolean>;
  points: IPointChartData[];
}
