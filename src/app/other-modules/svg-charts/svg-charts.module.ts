import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SvgPointChartComponent } from './components/svg-point-chart/svg-point-chart.component';
import { SvgChartInfoCardComponent } from './components/svg-chart-info-card/svg-chart-info-card.component';

const IMPORT_EXPORT_MODULES = [FlexLayoutModule];

@NgModule({
  declarations: [SvgPointChartComponent, SvgChartInfoCardComponent],
  exports: [IMPORT_EXPORT_MODULES, SvgPointChartComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
})
export class SvgChartsModule {}
