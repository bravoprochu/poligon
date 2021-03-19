export interface ICoinApiExchangeRate {
  type: string;
  asset_id_base: string;
  asset_id_quote: string;
  time: Date | string;
  rate: number;
}
