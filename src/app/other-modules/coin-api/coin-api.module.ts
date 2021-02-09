import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CoinApiRoutingModule } from './coin-api-routing.module';
import { CoinApiComponent } from './components/coin-api/coin-api.component';
import { CoinApiService } from './services/coin-api.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BasicTableModule } from '../basic-table/basic-table.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WebsocketsComponent } from './components/websockets/websockets.component';
import { MatFormFieldModule } from '@angular/material/form-field';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  HttpClientModule,
  BasicTableModule,
  MatFormFieldModule,
  ScrollingModule,
];

@NgModule({
  declarations: [CoinApiComponent, WebsocketsComponent],
  imports: [CommonModule, CoinApiRoutingModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES],
  providers: [CoinApiService],
})
export class CoinApiModule {}
