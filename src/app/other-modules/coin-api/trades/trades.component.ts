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
import { MaterialTableGenericDataSource } from '../../material-table/material-table-generic-data-source';
import {
  ITableColumn,
  TableColumnFieldType,
} from '../../material-table/interfaces/i-table-column';
import { CoinApiService } from '../services/coin-api.service';
import { ICoinApiTradesLatest } from './interfaces/i-coin-api-trades-latest';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trades',
  templateUrl: '../../material-table/templates/basic-table.html',
  styleUrls: ['../../material-table/templates/basic-table.scss'],
})
export class TradesComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ICoinApiTradesLatest>;
  constructor(private coinService: CoinApiService) {}

  dataSource: MaterialTableGenericDataSource<ICoinApiTradesLatest> = new MaterialTableGenericDataSource();
  /**
   *
   */

  isDestroyed$: Subject<boolean> = new Subject();
  search$: FormControl = new FormControl('');
  tableColumnsDefinition: ITableColumn[] = [];
  title: string = 'Coin API Trades';

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
      ? this.coinService.getTrades$()
      : this.coinService.getTradesMocked$();
  }

  initDataTable(): void {
    this.dataSource.tableColumnsDefinition = this.prepTableColumnsDefinition();
  }

  prepTableColumnsDefinition(): ITableColumn[] {
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
}
