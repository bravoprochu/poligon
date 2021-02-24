import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentifyGuard } from './other-modules/ident/guards/identify.guard';
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
    canLoad: [IdentifyGuard],
  },
  { path: 'identAuth', component: IdentAuthComponent },

  {
    path: '',
    redirectTo: 'coin-api/websockets',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
