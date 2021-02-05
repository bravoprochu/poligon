import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CoinApiRoutingModule } from './coin-api-routing.module';
import { CoinApiComponent } from './coin-api/coin-api.component';
import { CoinApiService } from './services/coin-api.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BasicTableModule } from '../basic-table/basic-table.module';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  HttpClientModule,
  BasicTableModule,
];

@NgModule({
  declarations: [CoinApiComponent],
  imports: [CommonModule, CoinApiRoutingModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES],
  providers: [CoinApiService],
})
export class CoinApiModule {}
