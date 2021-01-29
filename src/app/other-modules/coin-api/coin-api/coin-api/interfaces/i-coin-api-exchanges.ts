export interface ICoinApiExchanges {
  data_end?: string;
  data_orderbook_end?: Date | string;
  data_orderbook_start?: Date | string;
  data_quote_end?: Date | string;
  data_quote_start?: Date | string;
  data_start?: string;
  data_symbols_count: number;
  data_trade_end?: Date | string;
  data_trade_start?: Date | string;
  exchange_id: string;
  name: string;
  volume_1day_usd: number;
  volume_1hrs_usd: number;
  volume_1mth_usd: number;
  website: string;
}

export class CoinApiExchanes implements ICoinApiExchanges {
  data_end?: string | undefined;
  data_orderbook_end?: string | Date | undefined;
  data_orderbook_start?: string | Date | undefined;
  data_quote_end?: string | Date | undefined;
  data_quote_start?: string | Date | undefined;
  data_start?: string | undefined;
  data_symbols_count!: number;
  data_trade_end?: string | Date | undefined;
  data_trade_start?: string | Date | undefined;
  exchange_id!: string;
  name!: string;
  volume_1day_usd!: number;
  volume_1hrs_usd!: number;
  volume_1mth_usd!: number;
  website!: string;
}
