import { IChartSelected } from 'otherModules/svg-charts/interfaces/i-chart-selected';

export interface IChartSelectedRatePair extends IChartSelected {
  logoBase: string;
  logoQuote: string;
}
