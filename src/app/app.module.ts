import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './sites/home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MenuModule } from 'otherModules/menu/menu.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { IdentModule } from 'otherModules/ident/ident.module';
import { IdentAuthComponent } from './sites/ident-auth/ident-auth.component';
import { LogsModule } from 'otherModules/logs/logs.module';
import { LogsComponent } from './sites/logs/logs.component';
import { LogsService } from 'otherModules/logs/services/logs.service';
import { MatDividerModule } from '@angular/material/divider';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  IdentModule,
  LogsModule,
  MenuModule,
  MatCardModule,
  MatDividerModule,
  MatSidenavModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    IdentAuthComponent,
    LogsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IMPORT_EXPORT_MODULES,
    AppRoutingModule,
  ],
  providers: [LogsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
