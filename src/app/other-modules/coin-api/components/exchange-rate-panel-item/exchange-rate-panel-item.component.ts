import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IKeyValue } from 'otherModules/coin-api/interfaces/i-key-value';
import { CoinApiRatePairService } from 'otherModules/coin-api/services/coin-api-rate-pair.service';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'app-exchange-rate-panel-item',
  templateUrl: './exchange-rate-panel-item.component.html',
  styleUrls: ['./exchange-rate-panel-item.component.scss'],
})
export class ExchangeRatePanelItemComponent implements OnInit {
  @Input('isDisabled') isDisabled = true;
  @Input('ratePairsOptions') ratePairsOptions = [] as IKeyValue<number>[];
  @Output('delete') delete = new EventEmitter() as EventEmitter<boolean>;
  @Output('rateSelected') rateSelected = new EventEmitter<IKeyValue<string>>();
  ratePairName$ = this.coinApiRatePairService.getRatePairNameControl();
  isDestroyed$ = new Subject() as Subject<boolean>;
  ratePairsOptionsFiltered = [] as IKeyValue<number>[];

  constructor(private coinApiRatePairService: CoinApiRatePairService) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initObservables();
  }

  initObservables(): void {
    this.ratePairName$.valueChanges
      .pipe(
        startWith(''),
        debounceTime(750),
        distinctUntilChanged(),
        map((val) => {
          if (typeof val === 'string') {
            this.ratePairsOptionsFiltered =
              val === ''
                ? [...this.ratePairsOptions]
                : [
                    ...this.ratePairsOptions.filter(
                      (f) =>
                        f.key
                          .replace(' - ', '-')
                          .toLowerCase()
                          .includes(val.toLowerCase()) ||
                        f.key
                          .replace(' - ', '')
                          .toLowerCase()
                          .includes(val.toLowerCase()) ||
                        f.key.toLowerCase().includes(val.toLowerCase())
                    ),
                  ];
          }
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(
        (rateSelected$: any) => {
          if (this.ratePairName$.valid) {
            this.rateSelected.emit(this.ratePairName$.value);
          }
        },
        (error) => console.log('rateSelected$ error', error),
        () => console.log('rateSelected$ completed..')
      );
  }

  rateDisplayFn(rate: IKeyValue<number>): string {
    return rate && rate.key ? rate.key : '';
  }

  remove(): void {
    this.delete.emit(true);
  }
}
