import { IPointChart } from 'otherModules/svg-charts/interfaces/i-point-chart';

export interface IChartSelected {
  chart: IPointChart;
  pointsCount: number;
  ratePairId: number;
  title: string;
  width: number;
}
