import { ICoinApiExchangeRate } from '../../coin-api/interfaces/i-coin-api-exchange-rate';

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
