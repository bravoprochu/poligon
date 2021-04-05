import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IKeyValue } from 'otherModules/coin-api/interfaces/i-key-value';
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
  @Input('rForm$') rForm$ = new FormGroup({}) as FormGroup;
  @Input('isDisabled') isDisabled = true;
  @Input('ratePairsOptions') ratePairsOptions = [] as IKeyValue<number>[];
  @Output('delete') delete = new EventEmitter() as EventEmitter<boolean>;
  isDestroyed$ = new Subject() as Subject<boolean>;
  ratePairsOptionsFiltered = [] as IKeyValue<number>[];

  constructor() {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initObservables();
  }

  initObservables(): void {
    this.chartSelected$.valueChanges
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
        (chartSelectedSearch: any) => {},
        (error) => console.log('chartSelectedSearch error', error),
        () => console.log('chartSelectedSearch completed..')
      );
  }

  rateDisplayFn(rate: IKeyValue<number>): string {
    return rate && rate.key ? rate.key : '';
  }

  remove(): void {
    this.delete.emit(true);
  }

  get chartSelected$(): FormControl {
    return this.rForm$.get('chartSelected') as FormControl;
  }
}
