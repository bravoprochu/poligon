import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
  styleUrls: ['./coin-api-exchanges.component.sass']
})
export class CoinApiExchangesComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ICoinApiExchanges>;
  dataSource: CoinApiExchangesDataSource;


  /**
   *
   */
  constructor(
    private coinService: CoinApiService
  ) {
    this.dataSource = new CoinApiExchangesDataSource(coinService, this.isDestroyed$);
  }

  
  ngOnDestroy(): void {
       this.isDestroyed$.next(true);
       this.isDestroyed$.complete();
       this.isDestroyed$.unsubscribe();
  }
  
  
  

  ngOnInit() {
    this.initDataTable();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  displayedColumns = ['exchange_id', 'name', 'data_end', 'website'];
  isDestroyed$: Subject<boolean> = new Subject()
  

  initDataTable() {
                
  }

  refresh() {
    this.dataSource.refresh();
  }
}
