import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { YesNoDialogComponent } from './components/yes-no-dialog/yes-no-dialog.component';

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatButtonModule,
  MatDialogModule,
];

@NgModule({
  declarations: [YesNoDialogComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES],
  entryComponents: [YesNoDialogComponent],
})
export class CommonDialogsModule {}
