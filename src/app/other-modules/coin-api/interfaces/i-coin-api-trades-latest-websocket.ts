import { ICoinApiTradesLatest } from './i-coin-api-trades-latest';

export interface ICoinApiTradesLatestWebSocket extends ICoinApiTradesLatest {
  sequence: 3621;
  type: 'trade';
}
