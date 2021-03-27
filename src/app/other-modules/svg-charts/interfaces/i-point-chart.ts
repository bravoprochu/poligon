import { Subject } from 'rxjs';
import { IPointChartBasic } from './i-point-chart-basic';
import { IPointChartData } from './i-point-chart-data';
import { IPointChartSelectedPointInfo } from './i-point-chart-selected-point-info';
import { ISvgChartInfoCard } from './i-svg-chart-info-card';

export interface IPointChart extends IPointChartBasic {
  infoCard: ISvgChartInfoCard;
  pointChart: IPointChartSelectedPointInfo;
  points: IPointChartData[];
  pointsCount: number;
}
