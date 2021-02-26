import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { IS_HANDSET } from 'commonFunctions/is-handset';
import { IColorRangeDialogData } from '../../interfaces/i-color-range-dialog-data';
import { IColorRangeItem } from '../../interfaces/i-color-range-item';
import { IColorRangePercantage } from '../../interfaces/i-color-range-percentaga';
import { ColorRangeService } from '../../services/color-range.service';
import { IColorRangeInfo } from '../../services/i-color-range-info';
import { ColorChangeDialogComponent } from '../color-change-dialog/color-change-dialog.component';

@Component({
  selector: 'app-color-range',
  templateUrl: './color-range.component.html',
  styleUrls: ['./color-range.component.scss'],
})
export class ColorRangeComponent implements OnInit, OnDestroy {
  @ViewChild('colorInput') colorInput!: ElementRef;
  @Input('expanded') isExpanded = true;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private colorService: ColorRangeService,
    private dialog: MatDialog
  ) {}

  isDestroyed$: Subject<boolean> = new Subject();
  isHandset$ = IS_HANDSET(this.breakpointObserver);
  newColorRange?: IColorRangeItem;

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initColors();
    this.initExpandedPanel();
  }

  add(): void {
    this.colorService.addNewColorRange();
    this.changeColor(this.colorService.getLastColorRange());
  }

  changeColor(color: IColorRangeItem): void {
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

  initColors(): void {
    this.colorService.addToRange('#E72DFC', 200);
    this.colorService.addToRange('#D9279F', 400);
    this.colorService.addToRange('#F03756', 500);
    this.colorService.addToRange('#FC8B65', 1500);
  }

  initExpandedPanel(): void {
    setTimeout(() => {
      this.isExpanded = false;
    }, 2500);
  }

  get colors(): IColorRangeItem[] {
    return this.colorService.colorRanges;
  }

  get percentageRange(): IColorRangePercantage[] {
    return this.colorService.getPercentageRange();
  }

  get rangeInfo(): IColorRangeInfo {
    return this.colorService.getRangeInfo();
  }
}
