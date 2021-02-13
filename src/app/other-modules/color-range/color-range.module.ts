import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorRangeService } from './services/color-range.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorRangeComponent } from './color-range/color-range.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatFormFieldModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [ColorRangeComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES, ColorRangeComponent],
  providers: [ColorRangeService],
  entryComponents: [],
})
export class ColorRangeModule {}
