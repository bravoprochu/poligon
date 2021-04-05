import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IRouterData } from 'interfaces/i-router-data';
import { IdentifyGuard } from '../ident/guards/identify.guard';
import { CoinApiComponent } from './components/coin-api/coin-api.component';
import { RxjsWebsocketsComponent } from './components/rxjs-websockets/rxjs-websockets.component';
import { TablesComponent } from './components/tables/tables.component';
import { WebsocketsComponent } from './components/websockets/websockets.component';

const routes: Routes = [
  {
    path: 'home',
    component: CoinApiComponent,
    canActivate: [IdentifyGuard],
    data: { animation: 'Coin-api' } as IRouterData,
  },
  {
    path: 'websockets',
    component: WebsocketsComponent,
    canActivate: [IdentifyGuard],
  },
  {
    path: 'rxjs-websockets',
    component: RxjsWebsocketsComponent,
    canActivate: [],
    data: { animation: 'Coin-api' } as IRouterData,
  },
  {
    path: 'tables',
    component: TablesComponent,
    canActivate: [IdentifyGuard],
    data: { animation: 'Coin-api' } as IRouterData,
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoinApiRoutingModule {}
