import { ICoinApiExchangeRate } from './i-coin-api-exchange-rate';

export interface ICoinApiExchangeRatePair {
  id: number;
  name: string;
  asset_id_base: string;
  asset_id_base_logo?: string;
  asset_id_quote: string;
  asset_id_quote_logo?: string;
  rates: ICoinApiExchangeRate[];
}
