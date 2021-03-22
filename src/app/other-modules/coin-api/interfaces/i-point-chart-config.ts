import { IKeyValue } from './i-key-value';

export interface IPointChartConfig {
  chartSelected: IKeyValue<number>;
  pointsCount: number;
  width: number;
}
