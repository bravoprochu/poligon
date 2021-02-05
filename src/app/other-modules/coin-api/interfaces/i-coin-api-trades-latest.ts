export interface ICoinApiTradesLatest {
  symbol_id: string;
  time_exchange: Date | string;
  time_coinapi: Date | string;
  uuid: string;
  price: number;
  size: number;
  taker_side: string;
}
