import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicTableComponent } from './basic-table/basic-table.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  HttpClientModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatTableModule,
  MatSortModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [BasicTableComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES, BasicTableComponent],
})
export class BasicTableModule {}
