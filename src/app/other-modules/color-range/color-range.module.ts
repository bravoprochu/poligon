import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorRangeService } from './services/color-range.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorRangeComponent } from './components/color-range/color-range.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ColorChangeDialogComponent } from './components/color-change-dialog/color-change-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonDialogsModule } from '../dialogs/common-dialogs.module';
import { MatDividerModule } from '@angular/material/divider';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatFormFieldModule,
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule,
  ReactiveFormsModule,
  CommonDialogsModule,
];

@NgModule({
  declarations: [ColorRangeComponent, ColorChangeDialogComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES, ColorRangeComponent],
  providers: [ColorRangeService],
  entryComponents: [ColorChangeDialogComponent],
})
export class ColorRangeModule {}
