import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './sites/home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MenuModule } from './other-modules/menu/menu.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { IdentModule } from './other-modules/ident/ident.module';
import { IdentAuthComponent } from './sites/ident-auth/ident-auth.component';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  IdentModule,
  MenuModule,
  MatCardModule,
  MatSidenavModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [AppComponent, HomeComponent, IdentAuthComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IMPORT_EXPORT_MODULES,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
