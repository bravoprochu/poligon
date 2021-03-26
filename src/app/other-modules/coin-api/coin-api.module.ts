import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CoinApiRoutingModule } from './coin-api-routing.module';
import { CoinApiComponent } from './components/coin-api/coin-api.component';
import { CoinApiService } from './services/coin-api.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BasicTableModule } from '../basic-table/basic-table.module';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WebsocketsComponent } from './components/websockets/websockets.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorRangeModule } from '../color-range/color-range.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { TablesComponent } from './components/tables/tables.component';
import { RxjsWebsocketsComponent } from './components/rxjs-websockets/rxjs-websockets.component';
import { CoinApiRatePairService } from './services/coin-api-rate-pair.service';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { SvgChartsModule } from 'otherModules/svg-charts/svg-charts.module';
import { ExchangeRateChartComponent } from 'otherModules/coin-api/components/exchange-rate-chart/exchange-rate-chart.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ExchangeRatePanelComponent } from './components/exchange-rate-panel/exchange-rate-panel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ExchangeRatePanelItemComponent } from './components/exchange-rate-panel-item/exchange-rate-panel-item.component';

const IMPORT_EXPORT_MODULES = [
  SvgChartsModule,
  FlexLayoutModule,
  HttpClientModule,
  BasicTableModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatBadgeModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatTooltipModule,
  ScrollingModule,
  ColorRangeModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [
    CoinApiComponent,
    ExchangeRateChartComponent,
    WebsocketsComponent,
    TablesComponent,
    RxjsWebsocketsComponent,
    ExchangeRatePanelComponent,
    ExchangeRatePanelItemComponent,
  ],
  imports: [CommonModule, CoinApiRoutingModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES],
  providers: [CoinApiService, CoinApiRatePairService],
})
export class CoinApiModule {}
