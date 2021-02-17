import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { YesNoDialogComponent } from 'src/app/other-modules/dialogs/components/yes-no-dialog/yes-no-dialog.component';
import { IYesNoDialogData } from 'src/app/other-modules/dialogs/interfaces/i-yes-no-dialog-data';
import { IColorRangeDialogData } from '../../interfaces/i-color-range-dialog-data';
import { IColorRangeItem } from '../../interfaces/i-color-range-item';
import { ColorRangeService } from '../../services/color-range.service';

@Component({
  selector: 'app-color-change-dialog',
  templateUrl: './color-change-dialog.component.html',
  styleUrls: ['./color-change-dialog.component.scss'],
})
export class ColorChangeDialogComponent implements OnInit {
  constructor(
    private colorService: ColorRangeService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ColorChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IColorRangeDialogData,
    private yesNoDialog: MatDialog
  ) {}

  colorSelected?: IColorRangeItem;
  rForm!: FormGroup;
  isEditMode = false;
  temporaryColor?: IColorRangeItem;

  ngOnInit(): void {
    this.initForm();
  }

  resetData(): void {
    this.rForm.setValue(this.data.selectedColorRange);
    this.rForm.markAsPristine();
  }

  initForm(): void {
    this.rForm = this.colorService.getColorForm$(this.fb);
    this.temporaryColor = { ...this.data.selectedColorRange };
    this.rForm.setValue(this.temporaryColor);
    this.rForm.markAsPristine();
  }

  removeColor(): void {
    const takNieDialog = this.yesNoDialog.open(YesNoDialogComponent, {
      data: {
        title: 'Color range',
        question: 'Do You want to remove current color from range ?',
      } as IYesNoDialogData,
    });

    takNieDialog
      .afterClosed()
      .pipe()
      .subscribe(
        (yesNoClosed: any) => {
          console.log('takNieClosed subs:', yesNoClosed);

          if (yesNoClosed) {
            this.colorService.removeFromRange(this.data.selectedColorRange);
            this.dialogRef.close();
          }
        },
        (error) => console.log('takNieClosed error', error),
        () => console.log('takNieClosed completed..')
      );
  }

  updateColor(): void {
    this.dialogRef.close(this.rForm.value);
  }
}
