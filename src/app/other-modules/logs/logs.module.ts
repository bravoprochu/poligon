import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorLogComponent } from './components/error-log/error-log.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LogsService } from './services/logs.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatExpansionModule } from '@angular/material/expansion';
import { SimpleErrorComponent } from './components/simple-error/simple-error.component';
import { SimpleDebugComponent } from './components/simple-debug/simple-debug.component';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  ScrollingModule,
];

@NgModule({
  declarations: [ErrorLogComponent, SimpleErrorComponent, SimpleDebugComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  exports: [
    IMPORT_EXPORT_MODULES,
    ErrorLogComponent,
    SimpleErrorComponent,
    SimpleDebugComponent,
  ],
  providers: [LogsService],
})
export class LogsModule {}
