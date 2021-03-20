import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SvgPointChartComponent } from './components/svg-point-chart/svg-point-chart.component';

const IMPORT_EXPORT_MODULES = [FlexLayoutModule];

@NgModule({
  declarations: [SvgPointChartComponent],
  exports: [IMPORT_EXPORT_MODULES, SvgPointChartComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
})
export class SvgChartsModule {}
