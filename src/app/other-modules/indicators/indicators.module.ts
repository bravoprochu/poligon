import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorProgressComponent } from './components/progress-bar/indicator-progress.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const MATERIAL_MODULES = [MatProgressBarModule, MatSnackBarModule];

@NgModule({
  declarations: [IndicatorProgressComponent],
  imports: [CommonModule, ...MATERIAL_MODULES],
  exports: [IndicatorProgressComponent, ...MATERIAL_MODULES],
})
export class IndicatorsModule {}
