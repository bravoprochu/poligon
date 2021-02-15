import { Component, OnInit, ViewChild } from '@angular/core';
import { ITableColumn } from '../../../basic-table/interfaces/i-table-column';
import { TableColumnFieldType } from '../../../basic-table/interfaces/table-column-field-type-enum';
import { BasicTableDataSource } from '../../../basic-table/basic-table-data-source';
import { ICoinApiExchanges } from '../../interfaces/i-coin-api-exchanges';
import { CoinApiService } from '../../services/coin-api.service';
import { ICoinApiTradesLatest } from '../../interfaces/i-coin-api-trades-latest';
import { ICoinApiQuotesCurrent } from '../../interfaces/i-coin-api-quotes-current';
import { ICoinApiOrderBook } from '../../interfaces/i-coin-api-order-book';
import { BasicTableComponent } from '../../../basic-table/basic-table/basic-table.component';

@Component({
  selector: 'app-coin-api',
  templateUrl: './coin-api.component.html',
  styleUrls: ['./coin-api.component.scss'],
})
export class CoinApiComponent implements OnInit {
  ngOnInit(): void {}
}
