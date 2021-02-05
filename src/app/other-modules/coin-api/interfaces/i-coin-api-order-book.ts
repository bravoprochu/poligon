import { ICoinApiOrderBookAsk } from './i-coin-api-order-book-ask';

export interface ICoinApiOrderBook {
  symbol_id: string;
  time_exchange: Date | string;
  time_coinapi: Date | string;
  asks: ICoinApiOrderBookAsk[];
  bids: ICoinApiOrderBookAsk[];
}
