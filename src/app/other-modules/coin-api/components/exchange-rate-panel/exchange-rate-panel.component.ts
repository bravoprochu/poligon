import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IChartConfig } from 'otherModules/coin-api/interfaces/i-charts-config';
import { IKeyValue } from 'otherModules/coin-api/interfaces/i-key-value';
import { RxjsWebsocketService } from 'otherModules/coin-api/services/rxjs-websocket.service';
import { Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-exchange-rate-panel',
  templateUrl: './exchange-rate-panel.component.html',
  styleUrls: ['./exchange-rate-panel.component.scss'],
})
export class ExchangeRatePanelComponent implements OnInit, OnDestroy {
  @Input('ratePairsOption') ratePairsOptions = [] as IKeyValue<number>[];
  @Output('ratesSelected') ratesSelected = new EventEmitter<IChartConfig>();
  isDestroyed$ = new Subject() as Subject<boolean>;
  rForm$ = {} as FormGroup;

  constructor(
    private fb: FormBuilder,
    private rxjsWebsocketService: RxjsWebsocketService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initForms();
    this.initObservables();
  }

  addChart(): void {
    this.rxjsWebsocketService.addPointChart(this.pointCharts$, this.fb);
  }

  initForms(): void {
    this.rForm$ = this.rxjsWebsocketService.getChartsForm$(this.fb);
  }

  initObservables(): void {
    this.rForm$.valueChanges
      .pipe(debounceTime(50), takeUntil(this.isDestroyed$))
      .subscribe(
        (exchangeRatePanelForm: IChartConfig) => {
          if (this.rForm$.valid) {
            this.ratesSelected.emit(this.rForm$.value);
          }
        },
        (error) => console.log('exchangeRatePanelForm error', error),
        () => console.log('exchangeRatePanelForm completed..')
      );
  }

  removeChart(id: number): void {
    this.pointCharts$.removeAt(id);
  }

  test(): void {
    const firstGroup = this.pointCharts$.controls[0] as FormGroup;
    const searchPhrase = firstGroup.get('searchPhrase');
    console.log(this.rForm$, searchPhrase);
  }

  //#region form getters
  get pointCharts$(): FormArray {
    return this.rForm$.get('pointCharts') as FormArray;
  }

  getPointChartGroup$(id: number): FormGroup {
    return this.pointCharts$.at(id) as FormGroup;
  }

  //#endregion
}
