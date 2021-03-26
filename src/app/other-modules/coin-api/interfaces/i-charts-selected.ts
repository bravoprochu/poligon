import { ICoinApiExchangeRatePair } from './i-coin-api-exchange-rate-pair';

export interface IChartsSelected {
  chart: ICoinApiExchangeRatePair;
  //chartConfig: IChartConfig;
  pointsCount: number;
  width: number;
}
