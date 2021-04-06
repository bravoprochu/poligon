import { IKeyValue } from './i-key-value';

export interface IPointChartConfig {
  ratePair: IKeyValue<number>;
  pointsCount: number;
  width: number;
}
