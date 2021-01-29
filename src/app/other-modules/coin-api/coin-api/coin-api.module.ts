import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'

import { CoinApiRoutingModule } from './coin-api-routing.module';
import { CoinApiComponent } from './coin-api/coin-api.component';
import { CoinApiService } from '../services/coin-api.service';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { CoinApiExchangesComponent } from '../exchanges/coin-api-exchanges.component';
import { MatButtonModule } from '@angular/material/button';


const IMPORT_EXPORT_MODULES = [
  HttpClientModule,
  MatButtonModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatTableModule,
  MatSortModule,
]

@NgModule({
  declarations: [
    CoinApiComponent,
    CoinApiExchangesComponent
  ],
  imports: [
    CommonModule,
    CoinApiRoutingModule,
    IMPORT_EXPORT_MODULES
  ],
  exports: [
    IMPORT_EXPORT_MODULES
  ],
  providers: [
    CoinApiService
  ]
})
export class CoinApiModule { }
