import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { IColorRangeItem } from '../interfaces/i-color-range-item';
import { ColorRangeService } from './color-range.service';

@Component({
  selector: 'app-color-range',
  templateUrl: './color-range.component.html',
  styleUrls: ['./color-range.component.scss'],
})
export class ColorRangeComponent implements OnInit {
  @ViewChild('colorInput') colorInput!: ElementRef;
  constructor(
    private colorService: ColorRangeService,
    private fb: FormBuilder
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  colorSelected?: IColorRangeItem;
  colorTemp? = {} as IColorRangeItem;
  colors: IColorRangeItem[] = [];

  colorGrade$: FormControl = new FormControl();
  isDestroyed$: Subject<boolean> = new Subject();
  isEditMode: boolean = false;
  rForm!: FormGroup;

  ngOnInit(): void {
    this.initColors();
    this.initForms();
  }

  addToColor(color: string, max: number) {
    const lastMax =
      this.colors.length > 0 ? this.colors[this.colors.length - 1].max : 0;
    if (lastMax >= max) {
      return;
    }

    this.colors.push({
      color: color,
      max: max,
      min: lastMax,
    } as IColorRangeItem);
  }

  changeColor(color: IColorRangeItem) {
    this.colorSelected = color;
    this.isEditMode = true;
    this.colorTemp = {} as IColorRangeItem;
    Object.assign(this.colorTemp, color);
    this.rForm.setValue(this.colorTemp);

    const input = this.colorInput.nativeElement as HTMLInputElement;

    input.value = this.colorTemp.color;

    const idx = this.colors.indexOf(color);
    // input.click();
    input.onchange = (ev) => {
      // color.color = input.value;
    };
  }

  initColors() {
    // this.colors = [, , ', '#', '#'];
    this.addToColor('#E72DFC', 200);
    this.addToColor('#D9279F', 400);
    this.addToColor('#F03756', 500);
    this.addToColor('#D95C4E', 600);
    this.addToColor('#FC8B65', 1500);
    this.addToColor('#cB8B65', 2000);
    this.addToColor('#DB8B65', 2400);
  }

  initForms() {
    this.rForm = this.colorService.getColorForm$(this.fb);
  }

  fixRange() {
    console.log('range 3');
    let min = (this.rForm.value as IColorRangeItem).min;
    const minColors = this.colors[0].min;
    const max = (this.rForm.value as IColorRangeItem).max;
    const maxColors = this.colors[this.colors.length - 1].max;
    const newColor = this.colorSelected!.color;

    let newColors = [] as IColorRangeItem[];

    /**
     * special case
     *  one set only values are larger then any actual min/max
     *
     */

    if (min <= minColors && max >= maxColors) {
      newColors.push({
        color: newColor,
        min: min,
        max: max,
      } as IColorRangeItem);
      this.colors = newColors;
      return;
    }

    for (let index = 0; index < this.colors.length; index++) {
      const color = this.colors[index];

      if (min >= color.max) {
        /**
         * "1"
         * not intersected on left side
         * even min value is current.max (it will be MANAGE on the next item)
         * adds whole OLD item to new colors array
         *
         */
        console.log(index, '1, not intersected on left', color);
        newColors.push(color);
      } else if (min === color.min && max <= color.max) {
        /**
         * "2"
         * min meets current item.min AND current.max
         * is on the same range
         *
         */
        console.log(index, '2', color);
        /**
         *"2a"
         * pushes whole new range to new colors array
         *
         */
        newColors.push({
          color: newColor,
          min: min,
          max: max,
        } as IColorRangeItem);

        /**
         * "2b"
         * if doesnt ends equally at the end,
         * there is still old color item to add
         *
         */
        if (max !== color.max) {
          newColors.push({
            color: color.color,
            min: max,
            max: color.max,
          } as IColorRangeItem);
        }
      } else if (min > color.min && max < color.max) {
        /**
         * "3"
         * new item is inside old item
         * need to add 3 piecess. from item.min to new min,
         * whole new range,
         * and from new range max to item max...         *
         */
        console.log(index, '3', color);
        newColors.push({
          color: color.color,
          min: color.min,
          max: min,
        } as IColorRangeItem);

        newColors.push({
          color: newColor,
          min: min,
          max: max,
        } as IColorRangeItem);

        newColors.push({
          color: color.color,
          min: max,
          max: color.max,
        } as IColorRangeItem);
      } else if (min > color.min && max === color.max) {
        /**
         * "4"
         * whole new range is within current item
         * but is greater then current.min
         * need to add 2 pieces;
         * old to new min and new range
         *
         */
        console.log(index, '4', color);
        newColors.push({
          color: color.color,
          min: color.min,
          max: min,
        } as IColorRangeItem);

        newColors.push({
          color: newColor,
          min: min,
          max: max,
        } as IColorRangeItem);
      } else if (min >= color.min && min < color.max && max > color.max) {
        /**
         * "5"
         * new min value is within current item
         * but max is greater then current max
         * need to add 2 piecess as "4",
         * but here new max finishes on unknown next item
         *
         */
        console.log(index, '5', color);
        /**
         * "5a"
         * doesnt start at the beginnig of old item
         * so, need to add a piece with old color
         *
         */
        if (min !== color.min) {
          newColors.push({
            color: color.color,
            min: color.min,
            max: min,
          } as IColorRangeItem);
        }

        /**
         * "5b"
         * adds whole new range
         *
         */
        newColors.push({
          color: newColor,
          min: min,
          max: max,
        } as IColorRangeItem);
      } else if (min < color.min && max > color.min && max < color.max) {
        /**
         * "6"
         * started at some previous item
         * and end within current
         * adds only rest of old color
         *
         */
        console.log(index, '6', color);
        newColors.push({
          color: color.color,
          min: max,
          max: color.max,
        } as IColorRangeItem);
      } else if (max <= color.min && max !== color.max) {
        /**
         * "7"
         * not intersected on right side
         * adds every item thats on the rigth side of new range
         *
         */
        console.log(index, '7, not intersected on right', color);
        newColors.push(color);
      }
    }

    /**
     * replace colors array with new, fiexed one
     *
     */
    this.colors = newColors;
  }

  updateColor() {
    this.fixRange();
  }

  updateSelectedColorValues() {
    /**
     * set values from form (update curernt)
     *
     */
    this.colorSelected!.max = (this.rForm.value as IColorRangeItem).max;
    this.colorSelected!.min = (this.rForm.value as IColorRangeItem).min;
  }
}
