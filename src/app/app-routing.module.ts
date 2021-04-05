import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IRouterData } from 'interfaces/i-router-data';
import { IdentifyGuard } from 'otherModules/ident/guards/identify.guard';
import { HomeComponent } from './sites/home/home.component';
import { IdentAuthComponent } from './sites/ident-auth/ident-auth.component';
import { LogsComponent } from './sites/logs/logs.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'Home' } as IRouterData,
  },
  {
    path: 'coin-api',
    loadChildren: () =>
      import('otherModules/coin-api/coin-api.module').then(
        (m) => m.CoinApiModule
      ),
    canLoad: [IdentifyGuard],
  },
  {
    path: 'identAuth',
    component: IdentAuthComponent,
    data: { animation: 'Ident' } as IRouterData,
  },
  {
    path: 'logs',
    component: LogsComponent,
    data: { animation: 'Logs' } as IRouterData,
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
