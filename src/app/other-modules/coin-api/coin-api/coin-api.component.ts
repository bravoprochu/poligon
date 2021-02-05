import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ITableColumn } from '../../basic-table/interfaces/i-table-column';
import { TableColumnFieldType } from '../../basic-table/interfaces/table-column-field-type-enum';
import { BasicTableDataSource } from '../../basic-table/basic-table-data-source';
import { ICoinApiExchanges } from '../interfaces/i-coin-api-exchanges';
import { CoinApiService } from '../services/coin-api.service';
import { ICoinApiTradesLatest } from '../interfaces/i-coin-api-trades-latest';
import { ICoinApiQuotesCurrent } from '../interfaces/i-coin-api-quotes-current';

@Component({
  selector: 'app-coin-api',
  templateUrl: './coin-api.component.html',
  styleUrls: ['./coin-api.component.scss'],
})
export class CoinApiComponent implements OnInit {
  constructor(
    private changeDetection: ChangeDetectorRef,
    private coinService: CoinApiService
  ) {}

  dataSourceExchanges: BasicTableDataSource<ICoinApiExchanges> = new BasicTableDataSource(
    this.prepTableColumnsDefinitionExchanges(),
    this.coinService.getExchangesMocked$()
  );

  dataSourceTrades: BasicTableDataSource<ICoinApiTradesLatest> = new BasicTableDataSource(
    this.prepTableColumnsDefinitionTrades(),
    this.coinService.getTradesMocked$()
  );

  dataSourceQuotes: BasicTableDataSource<ICoinApiQuotesCurrent> = new BasicTableDataSource(
    this.prepTableColumnsDefinitionQuotes(),
    this.coinService.getQuotesMocked$()
  );

  selectedQuotes?: ICoinApiQuotesCurrent;

  ngOnInit(): void {}

  getData(): void {
    this.coinService.getExchanges$().subscribe(
      (exchanges: any) => {
        console.log('exchanges subs:', exchanges);
      },
      (error) => console.log('exchanges error', error),
      () => console.log('exchanges completed..')
    );
  }

  prepTableColumnsDefinitionExchanges(): ITableColumn[] {
    return [
      {
        caption: 'Id',
        propName: 'exchange_id',
        type: TableColumnFieldType.string,
      },
      {
        caption: 'Name',
        propName: 'name',
        type: TableColumnFieldType.string,
      },
      {
        caption: 'DataStart',
        propName: 'data_start',
        type: TableColumnFieldType.date,
      },
      {
        caption: 'DataEnd',
        propName: 'data_end',
        type: TableColumnFieldType.date,
      },
      {
        caption: 'Data Ordr start',
        propName: 'data_orderbook_start',
        type: TableColumnFieldType.dateMedium,
      },
      {
        caption: 'Data Ordr end',
        propName: 'data_orderbook_end',
        type: TableColumnFieldType.dateMedium,
      },

      {
        caption: 'Vol 1st hour USD',
        propName: 'volume_1hrs_usd',
        type: TableColumnFieldType.number,
      },
      {
        caption: 'Vol 1st day USD',
        propName: 'volume_1day_usd',
        type: TableColumnFieldType.number,
      },
      {
        caption: 'Vol 1st month USD',
        propName: 'volume_1mth_usd',
        type: TableColumnFieldType.number,
      },
      {
        caption: 'www',
        propName: 'website',
        type: TableColumnFieldType.www,
      },
    ];
  }

  prepTableColumnsDefinitionTrades(): ITableColumn[] {
    return [
      {
        caption: 'Id',
        propName: 'symbol_id',
        type: TableColumnFieldType.string,
      },
      {
        caption: 'exchange time',
        propName: 'time_exchange',
        type: TableColumnFieldType.date,
      },
      {
        caption: 'price',
        propName: 'price',
        type: TableColumnFieldType.number,
      },
      {
        caption: 'size',
        propName: 'size',
        type: TableColumnFieldType.date,
      },
    ];
  }

  prepTableColumnsDefinitionQuotes(): ITableColumn[] {
    return [
      {
        caption: 'Id',
        propName: 'symbol_id',
        type: TableColumnFieldType.string,
      },
      {
        caption: 'exchange time',
        propName: 'time_exchange',
        type: TableColumnFieldType.date,
      },
      {
        caption: 'ask price',
        propName: 'ask_price',
        type: TableColumnFieldType.number,
      },
      {
        caption: 'ask size',
        propName: 'ask_size',
        type: TableColumnFieldType.number,
      },
      {
        caption: 'bid price',
        propName: 'bid_price',
        type: TableColumnFieldType.number,
      },
      {
        caption: 'bid size',
        propName: 'bid_size',
        type: TableColumnFieldType.number,
      },
    ];
  }
}
