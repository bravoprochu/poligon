import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './sites/home/home.component';
import { IdentAuthComponent } from './sites/ident-auth/ident-auth.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'coin-api',
    loadChildren: () =>
      import('./other-modules/coin-api/coin-api.module').then(
        (m) => m.CoinApiModule
      ),
  },
  { path: 'identAuth', component: IdentAuthComponent },

  { path: '', redirectTo: 'coin-api/websockets', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
