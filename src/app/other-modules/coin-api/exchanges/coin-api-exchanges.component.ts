import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ICoinApiExchanges } from '../interfaces/i-coin-api-exchanges';
import {
  ITableColumn,
  TableColumnFieldType,
} from '../interfaces/i-table-column';
import { CoinApiService } from '../services/coin-api.service';
import { CoinApiExchangesDataSource } from './coin-api-exchanges-data-source';

const COIN_API_EXCHANGES_TABLE_COLUMNS_DEFINITION = [
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

@Component({
  selector: 'app-coin-api-exchanges',
  templateUrl: './coin-api-exchanges.component.html',
  styleUrls: ['./coin-api-exchanges.component.scss'],
})
export class CoinApiExchangesComponent
  implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ICoinApiExchanges>;
  dataSource: CoinApiExchangesDataSource;
  /**
   *
   */
  constructor(private coinService: CoinApiService) {
    this.dataSource = new CoinApiExchangesDataSource(
      COIN_API_EXCHANGES_TABLE_COLUMNS_DEFINITION
    );
  }

  isDestroyed$: Subject<boolean> = new Subject();
  search$: FormControl = new FormControl('');
  tableColumnsDefinition: ITableColumn[] = [];
  title: string = 'Coin API Exchanges';

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initDataTable();
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.dataFromcoinApiService$ = this.coinService.getExchangesMocked$();
  }

  initDataTable(): void {
    this.dataSource.tableColumnsDefinition = this.prepTableColumnsDefinition();
  }

  prepTableColumnsDefinition(): ITableColumn[] {
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
}
