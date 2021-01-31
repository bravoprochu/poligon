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
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
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
    this.dataSource = new CoinApiExchangesDataSource(coinService);
  }

  displayedColumns: string[] = [];
  isDestroyed$: Subject<boolean> = new Subject();
  tableColumns: ITableColumn[] = [];
  search$: FormControl = new FormControl('');
  title: string = 'Coin API Exchanges';

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initDataTable();
    this.initObservable();
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initDataTable(): void {
    this.tableColumns = this.dataSource.getTableColumns();
    const tablePropNames = this.dataSource
      .getTableColumns()
      .map((c: ITableColumn) => c.propName);
    this.displayedColumns = tablePropNames;
  }

  initObservable() {
    this.search$.valueChanges
      .pipe(
        takeUntil(this.isDestroyed$),
        debounceTime(750),
        distinctUntilChanged()
      )
      .subscribe(
        (search$: string) => {
          this.dataSource.filterSearch$.next(search$);
        },
        (error) => console.log('search$ error', error),
        () => console.log('search$ completed..')
      );
  }

  refresh(): void {
    this.dataSource.refresh();
  }
}
