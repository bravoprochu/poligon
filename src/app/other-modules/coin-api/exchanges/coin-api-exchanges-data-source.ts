import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, repeatWhen, take, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { Observable, merge, Subject, BehaviorSubject } from 'rxjs';
import { CoinApiService } from '../services/coin-api.service';
import { ICoinApiExchanges } from '../coin-api/coin-api/interfaces/i-coin-api-exchanges';



/**
 * Data source for the Exchanges view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CoinApiExchangesDataSource extends DataSource<ICoinApiExchanges> {
  constructor(
    private coinService: CoinApiService,
    private isDestroyed$: Subject<boolean>
  ) {
    super(); 
    this.initServiceDataObservable();
  }


  exchangesFromApi$ = new BehaviorSubject<ICoinApiExchanges[]>([]);
  data: ICoinApiExchanges[] = [];
  isGettingData$ = new BehaviorSubject<boolean>(true);
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
      this.exchangesFromApi$,
      this.sort.sortChange,
      this.paginator.page
    ];

    return merge(...obsToMerge$).pipe(
      takeUntil(this.isDestroyed$),
      tap((v)=>console.log(v)),
      map((_data:any)=>{     
        const res = this.getPagedData(this.getSortedData([...this.data]));
        return res;
      })
    )
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(){

  }
  

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: ICoinApiExchanges[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ICoinApiExchanges[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'exchange_id': return compare(+a.exchange_id, +b.exchange_id, isAsc);
        default: return 0;
      }
    });
  }

  initServiceDataObservable() {
    this.coinService.getExchanges$().pipe(
      takeUntil(this.isDestroyed$),
      tap(()=>{
        this.resetSortGroupSettings();
      }),
      repeatWhen(()=>this.refreshHit$)
    )
    .subscribe(
         (_coin_exchanges:any)=>{
            this.data = _coin_exchanges;
              this.exchangesFromApi$.next(_coin_exchanges);
              this.isGettingData$.next(false);
         },
         (error)=>console.log('_coin_exchanges error', error),
         ()=>console.log('_coin_exchanges completed..')
    );
  }

  refresh(){
    this.isGettingData$.next(true);
    this.refreshHit$.next(true);
  }

  resetSortGroupSettings() {
    this.paginator.firstPage();
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}