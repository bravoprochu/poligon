import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoinApiComponent } from './components/coin-api/coin-api.component';
import { WebsocketsComponent } from './components/websockets/websockets.component';

const routes: Routes = [
  { path: 'list', component: CoinApiComponent },
  { path: 'websockets', component: WebsocketsComponent },
  { path: '', redirectTo: 'websockets', pathMatch: 'full' },
  { path: '**', redirectTo: 'websockets' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoinApiRoutingModule {}
