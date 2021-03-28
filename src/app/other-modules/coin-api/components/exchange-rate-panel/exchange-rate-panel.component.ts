import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IChartConfigPanel } from 'otherModules/coin-api/interfaces/i-charts-config-panel';
import { IKeyValue } from 'otherModules/coin-api/interfaces/i-key-value';
import { CoinApiRatePairService } from 'otherModules/coin-api/services/coin-api-rate-pair.service';
import { Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-exchange-rate-panel',
  templateUrl: './exchange-rate-panel.component.html',
  styleUrls: ['./exchange-rate-panel.component.scss'],
})
export class ExchangeRatePanelComponent implements OnInit, OnDestroy {
  @Output('chartsSelected')
  chartsSelected = new EventEmitter() as EventEmitter<IChartConfigPanel>;
  isDestroyed$ = new Subject() as Subject<boolean>;
  ratePairsOptions = [] as IKeyValue<number>[];
  rForm$ = {} as FormGroup;

  constructor(
    private fb: FormBuilder,
    private ratePairService: CoinApiRatePairService
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
    this.ratePairService.addPointChart(this.pointCharts$, this.fb);
  }

  getPointChartGroup$(id: number): FormGroup {
    return this.pointCharts$.at(id) as FormGroup;
  }

  initForms(): void {
    this.rForm$ = this.ratePairService.getChartsForm$(this.fb);
  }

  initObservables(): void {
    this.ratePairService.ratePairCreated$
      .pipe(debounceTime(500), takeUntil(this.isDestroyed$))
      .subscribe(
        (panelRateGetNewRates: any) => {
          console.log('panelRateGetNewRates subs:', panelRateGetNewRates);
          this.ratePairsOptions = this.ratePairService.getRatePairAvailableOptions();
        },
        (error) => console.log('panelRateGetNewRates error', error),
        () => console.log('panelRateGetNewRates completed..')
      );

    this.rForm$.valueChanges
      .pipe(debounceTime(50), takeUntil(this.isDestroyed$))
      .subscribe(
        (exchangeRatePanelForm: IChartConfigPanel) => {
          if (this.rForm$.valid) {
            this.chartsSelected.emit({
              chartsSelected: exchangeRatePanelForm.chartsSelected,
            });
          }
        },
        (error) => console.log('exchangeRatePanelForm error', error),
        () => console.log('exchangeRatePanelForm completed..')
      );
  }

  removeChart(id: number): void {
    this.pointCharts$.removeAt(id);
  }

  //#region form getters
  get pointCharts$(): FormArray {
    return this.rForm$.get('chartsSelected') as FormArray;
  }

  //#endregion
}
