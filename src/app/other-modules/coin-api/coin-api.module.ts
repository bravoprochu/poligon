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
import { RxjsWebsocketService } from './services/rxjs-websocket.service';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { ExchangeRateChartComponent } from './components/exchange-rate-chart/exchange-rate-chart.component';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  HttpClientModule,
  BasicTableModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatBadgeModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatTooltipModule,
  ScrollingModule,
  ColorRangeModule,
];

@NgModule({
  declarations: [
    CoinApiComponent,
    WebsocketsComponent,
    TablesComponent,
    RxjsWebsocketsComponent,
    ExchangeRateChartComponent,
  ],
  imports: [CommonModule, CoinApiRoutingModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES],
  providers: [CoinApiService, RxjsWebsocketService],
})
export class CoinApiModule {}
