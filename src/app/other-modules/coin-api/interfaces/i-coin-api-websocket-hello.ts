export interface ICoinApiWebsocketHello {
  type: string;
  apikey: string;
  heartbeat: false;
  subscribe_data_type?: string[];
  subscribe_filter_asset_id?: string[];
  subscribe_filter_exchange_id?: string[];
  subscribe_filter_period_id?: string[];
  subscribe_filter_symbol_id?: string[];
  subscribe_update_limit_ms_quote?: number;
  subscribe_update_limit_ms_book_snapshot?: number;
}
