import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoinApiComponent } from './coin-api/coin-api.component';

const routes: Routes = [
  { path: 'list', component: CoinApiComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: '**', redirectTo: 'list' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoinApiRoutingModule {}
