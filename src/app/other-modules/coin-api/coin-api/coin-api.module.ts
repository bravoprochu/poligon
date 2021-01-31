import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CoinApiRoutingModule } from './coin-api-routing.module';
import { CoinApiComponent } from './coin-api/coin-api.component';
import { CoinApiService } from '../services/coin-api.service';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CoinApiExchangesComponent } from '../exchanges/coin-api-exchanges.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  HttpClientModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatTableModule,
  MatSortModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [CoinApiComponent, CoinApiExchangesComponent],
  imports: [CommonModule, CoinApiRoutingModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES],
  providers: [CoinApiService],
})
export class CoinApiModule {}
