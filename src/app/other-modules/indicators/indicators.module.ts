import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const MATERIAL_MODULES = [MatProgressBarModule, MatSnackBarModule];

@NgModule({
  declarations: [ProgressBarComponent],
  imports: [CommonModule, ...MATERIAL_MODULES],
  exports: [ProgressBarComponent, ...MATERIAL_MODULES],
})
export class IndicatorsModule {}
