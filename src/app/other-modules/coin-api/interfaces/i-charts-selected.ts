import { ISvgChartInfoCard } from 'otherModules/svg-charts/interfaces/i-svg-chart-info-card';
import { ICoinApiExchangeRatePair } from './i-coin-api-exchange-rate-pair';

export interface IChartsSelected {
  chart: ICoinApiExchangeRatePair;
  size: number;
}
