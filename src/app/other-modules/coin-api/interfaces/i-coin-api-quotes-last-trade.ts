export interface ICoinApiQuotesLastTrade {
  time_exchange: Date | string;
  time_coinapi: Date | string;
  uuid: string;
  price: number;
  size: number;
  taker_side: string;
}
