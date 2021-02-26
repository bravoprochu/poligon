import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicVirtualScrollViewportComponent } from './components/basic-virtual-scroll-viewport/basic-virtual-scroll-viewport.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

const IMPORT_EXPORT_MODULES = [ScrollingModule];

@NgModule({
  declarations: [BasicVirtualScrollViewportComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES, BasicVirtualScrollViewportComponent],
})
export class BasicVirtualScrollViewportModule {}
