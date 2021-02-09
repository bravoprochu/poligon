export interface ICoinApiWebsocketHello {
  type: string;
  apikey: string;
  heartbeat: false;
  subscribe_data_type: string[];
  subscribe_filter_symbol_id?: string[];
}
