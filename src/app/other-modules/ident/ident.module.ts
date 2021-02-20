import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './components/login/login-user.component';
import { IndicatorsModule } from '../indicators/indicators.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { IdentDataFactoryService } from './services/ident-data-factory.service';
import { RegisterUserComponent } from './components/register/register-user.component';
import { UserStatusComponent } from './components/user-status/user-status.component';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  HttpClientModule,
  IndicatorsModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTabsModule,
];

@NgModule({
  declarations: [LoginComponent, RegisterUserComponent, UserStatusComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  exports: [
    LoginComponent,
    RegisterUserComponent,
    UserStatusComponent,
    IMPORT_EXPORT_MODULES,
  ],
  providers: [IdentDataFactoryService, LoginService],
})
export class IdentModule {}
