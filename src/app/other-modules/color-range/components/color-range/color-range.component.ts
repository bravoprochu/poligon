import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { IColorRangeDialogData } from '../../interfaces/i-color-range-dialog-data';
import { IColorRangeItem } from '../../interfaces/i-color-range-item';
import { ColorRangeService } from '../../services/color-range.service';
import { ColorChangeDialogComponent } from '../color-change-dialog/color-change-dialog.component';

@Component({
  selector: 'app-color-range',
  templateUrl: './color-range.component.html',
  styleUrls: ['./color-range.component.scss'],
})
export class ColorRangeComponent implements OnInit {
  @ViewChild('colorInput') colorInput!: ElementRef;
  constructor(
    private colorService: ColorRangeService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  isDestroyed$: Subject<boolean> = new Subject();
  newColorRange?: IColorRangeItem;

  ngOnInit(): void {
    this.initColors();
  }

  add() {
    this.colorService.addNewColorRange();
    this.changeColor(this.colorService.getLastColorRange());
  }

  changeColor(color: IColorRangeItem) {
    const colorChangeDialog = this.dialog.open(ColorChangeDialogComponent, {
      data: {
        selectedColorRange: color,
      } as IColorRangeDialogData,
    });

    colorChangeDialog
      .afterClosed()
      .pipe()
      .subscribe(
        (dataFromDialog: IColorRangeItem) => {
          console.log('dialogOpen subs:', dataFromDialog);
          if (dataFromDialog) {
            color.color = dataFromDialog.color;
            this.colorService.fixColorRanges(color, dataFromDialog);
          }
        },
        (error) => console.log('dialogOpen error', error),
        () => console.log('dialogOpen completed..')
      );
  }

  initColors() {
    this.colorService.addToRange('#E72DFC', 200);
    this.colorService.addToRange('#D9279F', 400);
    this.colorService.addToRange('#F03756', 500);
    this.colorService.addToRange('#D95C4E', 600);
    this.colorService.addToRange('#FC8B65', 1500);
    this.colorService.addToRange('#cB8B65', 2000);
    this.colorService.addToRange('#DB8B65', 2400);
  }

  get colors(): IColorRangeItem[] {
    return this.colorService.colorRanges;
  }
}
