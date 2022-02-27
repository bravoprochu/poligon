import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  repeatWhen,
  tap,
} from 'rxjs/operators';
import { Observable, merge, Subject, BehaviorSubject, of } from 'rxjs';
import { ITableColumn } from './interfaces/i-table-column';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TableColumnFieldType } from './interfaces/table-column-field-type-enum';

type TableDataTypes = number | string;

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
const COMPARE_FN = (
  /**
   * checks values, return 0 if equal
   * -1 if prev is smaller then next
   * and 1 if next is greater then prev
   */

  prev: TableDataTypes,
  next: TableDataTypes,
  isAsc: boolean
): number => {
  if (prev === next) {
    return 0;
  }

  return (prev < next ? -1 : 1) * (isAsc ? 1 : -1);
};

/**
 * Data source for the Exchanges view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class BasicTableDataSource<T> extends DataSource<T> {
  data: T[] = [];

  errorInfo!: string;
  filteredData: T[] = [];
  filterSearchString = '';
  filterSearch$: FormControl = new FormControl('');
  isGettingData$ = new BehaviorSubject<boolean>(true);
  pageSizeOptions: number[] = [];
  pageSizeOptions$: BehaviorSubject<number[]> = new BehaviorSubject(
    [] as number[]
  );
  paginator!: MatPaginator;
  refreshHit$: Subject<boolean> = new Subject();
  sort!: MatSort;

  constructor(
    public tableColumnsDefinition: ITableColumn[] = [],
    public dataFromcoinApiService$: Observable<T[]> = of([])
  ) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * returns A stream of the items to be rendered.
   */

  connect(): Observable<T[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const obsToMerge$ = [
      this.dataFromcoinApiService$.pipe(
        tap((coinExchanges: T[]) => {
          /**
           * if error - got of(error object)
           *
           */
          if (Array.isArray(coinExchanges)) {
            this.resetSortGroupSettings();
            this.data = coinExchanges;
            this.errorInfo = '';
          } else {
            console.log(coinExchanges);
            this.errorInfo = (coinExchanges as HttpErrorResponse)?.error?.error;
          }
          this.isGettingData$.next(false);
        }),
        repeatWhen(() => this.refreshHit$)
      ),
      this.filterSearch$.valueChanges.pipe(
        debounceTime(750),
        distinctUntilChanged(),
        tap((searchString: string) => (this.filterSearchString = searchString))
      ),
      this.paginator.page,
      this.refreshHit$,
      this.sort.sortChange,
    ];

    return merge([...obsToMerge$]).pipe(
      map((data) => {
        this.filteredData = [
          ...this.filterTableClientSide(
            [...this.data],
            this.filterSearchString
          ),
        ];
        return this.getPagedData(this.getSortedData([...this.filteredData]));
      }),
      tap((data: T[]) => {
        this.pageSizeOptions = [...this.prepPageSizeOptions(this.filteredData)];
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  get displayedColumns(): string[] {
    return this.tableColumnsDefinition.map((c: ITableColumn) => c.propName);
  }

  filterTableClientSide(data: T[], search: string): T[] {
    if (!search || data.length === 0) {
      return data;
    }
    /**
     *  only string props are filtered
     *
     */
    const stringPropNames = this.tableColumnsDefinition.filter(
      (f: ITableColumn) => f.type === TableColumnFieldType.text
    );

    const coinApiExchangeObj = data[0];
    let fullString = '';
    const res = data.filter((f) => {
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

  refresh(): void {
    this.isGettingData$.next(true);
    this.refreshHit$.next(true);
  }

  resetSortGroupSettings(): void {
    this.paginator.firstPage();
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: T[]): T[] {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: T[]): T[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((prev, next) => {
      const isAsc = this.sort.direction === 'asc';

      const definition = this.tableColumnsDefinition.find(
        (columnDescription) => columnDescription.propName === this.sort.active
      )?.propName;

      const prevKeys = definition as keyof typeof prev;
      const nextKeys = definition as keyof typeof next;

      const prevVal = prev[prevKeys];
      const nextVal = next[nextKeys];

      if (
        (typeof prevVal === 'string' && typeof nextVal === 'string') ||
        (typeof prevVal === 'number' && typeof nextVal === 'number')
      ) {
        return COMPARE_FN(prevVal, nextVal, isAsc);
      }

      return 0;
    });
  }

  /**
   * definition of table columns based on interface
   *
   */

  // initServiceDataObservable(): void {
  //   this.dataFromcoinApiService$ = this.coinService.getExchanges$().pipe(
  //     tap(() => {
  //       this.resetSortGroupSettings();
  //     }),
  //     tap((coinExchanges) => {
  //       this.data = coinExchanges;
  //       // this.pageSizeOptions = this.prepPageSizeOptions(this.data);
  //       this.isGettingData$.next(false);
  //     }),
  //     repeatWhen(() => this.refreshHit$)
  //   );
  // }

  /**
   * generate page size options based on length
   *
   */

  private prepPageSizeOptions(data: T[]): number[] {
    const res: number[] = [];
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
}
