import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentifyGuard } from '../ident/guards/identify.guard';
import { CoinApiComponent } from './components/coin-api/coin-api.component';
import { TablesComponent } from './components/tables/tables.component';
import { WebsocketsComponent } from './components/websockets/websockets.component';

const routes: Routes = [
  { path: 'home', component: CoinApiComponent, canActivate: [IdentifyGuard] },
  {
    path: 'websockets',
    component: WebsocketsComponent,
    canActivate: [IdentifyGuard],
  },
  { path: 'tables', component: TablesComponent, canActivate: [IdentifyGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoinApiRoutingModule {}
