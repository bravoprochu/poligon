import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, repeatWhen, tap } from 'rxjs/operators';
import { Observable, merge, Subject, BehaviorSubject, of } from 'rxjs';
import { CoinApiService } from '../services/coin-api.service';
import { ICoinApiExchanges } from '../coin-api/coin-api/interfaces/i-coin-api-exchanges';
import {
  ITableColumn,
  TableColumnFieldType,
} from '../coin-api/coin-api/interfaces/i-table-column';

/**
 * Data source for the Exchanges view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CoinApiExchangesDataSource extends DataSource<ICoinApiExchanges> {
  constructor(private coinService: CoinApiService) {
    super();
    this.initServiceDataObservable();
  }

  data: ICoinApiExchanges[] = [];
  dataFromcoinApiService$: Observable<ICoinApiExchanges[]> = of([]);
  filteredData: ICoinApiExchanges[] = [];
  filterSearchString: string = '';
  filterSearch$: Subject<string> = new Subject();
  isGettingData$ = new BehaviorSubject<boolean>(true);
  pageSizeOptions: number[] = [];
  pageSizeOptions$: BehaviorSubject<number[]> = new BehaviorSubject(
    <number[]>[]
  );
  paginator!: MatPaginator;

  refreshHit$: Subject<boolean> = new Subject();
  sort!: MatSort;

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ICoinApiExchanges[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const obsToMerge$ = [
      this.dataFromcoinApiService$,
      this.refreshHit$,
      this.filterSearch$.pipe(
        tap((searchString: string) => (this.filterSearchString = searchString))
      ),
      this.sort.sortChange,
      this.paginator.page,
    ];

    return merge(...obsToMerge$).pipe(
      map((data) => {
        this.filteredData = [
          ...this.filterTableClientSide(
            [...this.data],
            this.filterSearchString
          ),
        ];
        return this.getPagedData(this.getSortedData([...this.filteredData]));
      }),
      tap((data: ICoinApiExchanges[]) => {
        this.pageSizeOptions = [...this.prepPageSizeOptions(this.filteredData)];
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  filterTableClientSide(
    data: ICoinApiExchanges[],
    search: string
  ): ICoinApiExchanges[] {
    if (!search || data.length == 0) {
      return data;
    }

    /**
     *  only string props are filtered
     *
     */

    const stringPropNames = this.getTableColumns().filter(
      (f: ITableColumn) => f.type == TableColumnFieldType.string
    );

    const coinApiExchangeObj = data[0];
    let fullString: string = '';
    let res = data.filter((f) => {
      /**
       * concat string values into one 'fullString'
       *
       */
      stringPropNames.forEach((prop) => {
        const stringPropNamesFields = prop.propName as keyof typeof coinApiExchangeObj;
        fullString += f[stringPropNamesFields];
      });

      /**
       * return if contains
       *
       */
      const isContaining = fullString
        .toLowerCase()
        .includes(search.toLowerCase())
        ? f
        : null;
      fullString = '';
      return isContaining;
    });
    return res;
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: ICoinApiExchanges[]): ICoinApiExchanges[] {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ICoinApiExchanges[]): ICoinApiExchanges[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';

      const definition = this.getTableColumns().find(
        (f) => f.propName == this.sort.active
      )?.propName;

      const aKey = definition as keyof typeof a;
      const bKey = definition as keyof typeof b;

      return compare(a[aKey], b[bKey], isAsc);
    });
  }

  /**
   * definition of table columns based on interface
   *
   */
  getTableColumns(): ITableColumn[] {
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

  initServiceDataObservable(): void {
    this.dataFromcoinApiService$ = this.coinService.getExchanges$().pipe(
      tap(() => {
        this.resetSortGroupSettings();
      }),
      tap((coinExchanges) => {
        this.data = coinExchanges;
        // this.pageSizeOptions = this.prepPageSizeOptions(this.data);
        this.isGettingData$.next(false);
      }),
      repeatWhen(() => this.refreshHit$)
    );
  }

  /**
   * generate page size options based on length
   *
   */
  private prepPageSizeOptions(data: ICoinApiExchanges[]): number[] {
    let res: number[] = [];
    if (data.length > 10) {
      res.push(10);
    }
    if (data.length > 25) {
      res.push(25);
    }
    if (data.length > 50) {
      res.push(50);
    }
    if (data.length > 100) {
      res.push(100);
    }

    /**
     * add data lenght page size if greater then one page
     *
     */
    if (data.length > 10) {
      res.push(data.length);
    }

    return res;
  }

  refresh(): void {
    this.isGettingData$.next(true);
    this.refreshHit$.next(true);
  }

  resetSortGroupSettings(): void {
    this.paginator.firstPage();
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: TableDataTypes, b: TableDataTypes, isAsc: boolean): number {
  if (!a || !b) {
    return 0;
  }
  return (a! < b! ? -1 : 1) * (isAsc ? 1 : -1);
}

type TableDataTypes = number | string | Date | undefined;
