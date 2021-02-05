import { ICoinApiQuotesLastTrade } from './i-coin-api-quotes-last-trade';

export interface ICoinApiQuotesCurrent {
  symbol_id: string;
  time_exchange: Date | string;
  time_coinapi: Date | string;
  ask_price: number;
  ask_size: number;
  bid_price: number;
  bid_size: number;
  last_trade?: ICoinApiQuotesLastTrade;
}
