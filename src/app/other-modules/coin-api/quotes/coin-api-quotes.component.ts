import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatRow, MatTable } from '@angular/material/table';
import { of, Subject } from 'rxjs';
import { delay, filter, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  ITableColumn,
  TableColumnFieldType,
} from '../../material-table/interfaces/i-table-column';
import { MaterialTableGenericDataSource } from '../../material-table/material-table-generic-data-source';
import { COIN_API_QUOUTES_CURRENT } from '../mock-data/coin-api-quotes-current';
import { CoinApiService } from '../services/coin-api.service';
import { ICoinApiQuotesCurrent } from './interfaces/i-coin-api-quotes-current';
import { ICoinApiQuotesLastTrade } from './interfaces/i-coin-api-quotes-last-trade';

@Component({
  selector: 'app-coin-api-quotes',
  templateUrl: './coin-api-quotes.component.html',
  styleUrls: ['./coin-api-quotes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CoinApiQuotesComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ICoinApiQuotesCurrent>;
  constructor(private coinService: CoinApiService) {
    // this.expandedElement = COIN_API_QUOUTES_CURRENT[0].last_trade!;
  }

  dataSource: MaterialTableGenericDataSource<ICoinApiQuotesCurrent> = new MaterialTableGenericDataSource();
  /**
   *
   */

  expandedElement!: ICoinApiQuotesCurrent | null;
  isDestroyed$: Subject<boolean> = new Subject();
  search$: FormControl = new FormControl('');
  tableColumnsDefinition: ITableColumn[] = [];
  title: string = 'Coin API - Quotes current';

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
      ? this.coinService.getQuotes$()
      : this.coinService.getQuotesMocked$();

    /**
     * open expandad data for first detail data
     * wait 1,5s to data
     */

    this.dataSource.isGettingData$
      .pipe(
        filter((f: Boolean) => f === false),
        delay(500),
        tap(() => this.setExpandadElementForAvailableData())
      )
      .subscribe(
        (gettingDataFalse: any) => {
          console.log('gettingDataFalse subs:', gettingDataFalse);
        },
        (error) => console.log('gettingDataFalse error', error),
        () => console.log('gettingDataFalse completed..')
      );
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

  setExpandadElementForAvailableData() {
    const el = this.dataSource.filteredData.find((f) => f.last_trade)!;
    console.log(el);
    this.expandedElement = el;
  }
}
