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
import { ICoinApiExchanges } from './interfaces/i-coin-api-exchanges';
import { ITableColumn } from '../../material-table/interfaces/i-table-column';
import { CoinApiService } from '../services/coin-api.service';
import { BasicTableDataSource } from '../../material-table/basic-table-data-source';
import { environment } from 'src/environments/environment';
import { TableColumnFieldType } from '../../material-table/interfaces/table-column-field-type-enum';

@Component({
  selector: 'app-coin-api-exchanges',
  templateUrl: '../../material-table/templates/basic-table.html',
  styleUrls: ['../../material-table/templates/basic-table.scss'],
})
export class CoinApiExchangesComponent
  implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ICoinApiExchanges>;
  dataSource: BasicTableDataSource<ICoinApiExchanges> = new BasicTableDataSource();
  /**
   *
   */
  constructor(private coinService: CoinApiService) {}

  isDestroyed$: Subject<boolean> = new Subject();
  search$: FormControl = new FormControl('');
  tableColumnsDefinition: ITableColumn[] = [];
  title: string = 'Coin API - Exchanges';

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
    /**
     * setting data stream for data source
     *
     */
    this.dataSource.dataFromcoinApiService$ = environment.isRealServerData
      ? this.coinService.getExchanges$()
      : this.coinService.getExchangesMocked$();
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
