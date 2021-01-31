import { Component, OnInit } from '@angular/core';
import { CoinApiService } from '../services/coin-api.service';

@Component({
  selector: 'app-coin-api',
  templateUrl: './coin-api.component.html',
  styleUrls: ['./coin-api.component.scss'],
})
export class CoinApiComponent implements OnInit {
  constructor(private coinService: CoinApiService) {}

  ngOnInit(): void {}

  getData(): void {
    this.coinService.getExchanges$().subscribe(
      (exchanges: any) => {
        console.log('exchanges subs:', exchanges);
      },
      (error) => console.log('exchanges error', error),
      () => console.log('exchanges completed..')
    );
  }
}
