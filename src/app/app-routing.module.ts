import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './sites/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'coin-api',
    loadChildren: () =>
      import('./other-modules/coin-api/coin-api.module').then(
        (m) => m.CoinApiModule
      ),
  },

  { path: '', redirectTo: 'coin-api', pathMatch: 'full' },
  { path: '**', redirectTo: 'coin-api' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
