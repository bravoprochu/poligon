import { ICoinApiExchangeRate } from '../i-coin-api-exchange-rate';
import { IChartLine } from './i-chart-line';

export type TrendColor = 'red' | 'green';

export interface IChartExchangeRate {
  id: number;
  color: TrendColor;
  isIncreasing: boolean;
  timeRelative: number;
  timeToMax: number;
  valueToMax: number;
  valueChange: number;
  valueChangePercentage: number;

  rate: ICoinApiExchangeRate;
}
