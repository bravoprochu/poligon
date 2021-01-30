import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ICoinApiExchanges } from '../coin-api/coin-api/interfaces/i-coin-api-exchanges';
import { ITableColumn } from '../coin-api/coin-api/interfaces/i-table-column';
import { CoinApiService } from '../services/coin-api.service';
import { CoinApiExchangesDataSource } from './coin-api-exchanges-data-source';

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
      coinService,
      this.isDestroyed$
    );
  }

  displayedColumns: string[] = [];
  isDestroyed$: Subject<boolean> = new Subject();
  tableColumns: ITableColumn[] = [];

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initDataTable();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  initDataTable(): void {
    this.tableColumns = this.dataSource.getTableColumns();
    const tdef = this.dataSource
      .getTableColumns()
      .map((c: ITableColumn) => c.propName);
    this.displayedColumns = tdef;
  }

  refresh(): void {
    this.dataSource.refresh();
  }
}
