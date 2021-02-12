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
         * not intersected on left side
         * even min value can be set on item max (it will be FIX on the next item)
         *
         */
        console.log(index, 'not intersected on left', color);
        newColors.push(color);
      } else if (min === color.min && max <= color.max) {
        /**
         * "1"
         * min meets min but ends on the same item
         *
         */
        console.log(index, '1', color);
        newColors.push({
          color: newColor,
          min: min,
          max: max,
        } as IColorRangeItem);

        /**
         * if doesnt ends equally at the end, there is still old color item
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
         *
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
         * "2"
         *
         */
        console.log(index, '2', color);
        newColors.push({
          color: color.color,
          min: color.min,
          max: min,
        } as IColorRangeItem);

        newColors.push({
          color: newColor,
          min: min,
          max: color.max,
        } as IColorRangeItem);
      } else if (min >= color.min && min < color.max && max > color.max) {
        /**
         * "4"
         *
         */
        console.log(index, '4', color);
        if (min !== color.min) {
          newColors.push({
            color: color.color,
            min: color.min,
            max: min,
          } as IColorRangeItem);
        }

        newColors.push({
          color: newColor,
          min: min,
          max: max,
        } as IColorRangeItem);
      } else if (min < color.min && max > color.min && max < color.max) {
        /**
         * "5"
         *
         */
        console.log(index, '5', color);
        newColors.push({
          color: color.color,
          min: max,
          max: color.max,
        } as IColorRangeItem);
      } else if (max <= color.min && max !== color.max) {
        /**
         * not intersected on right side
         *
         */
        console.log(index, 'not intersected on right', color);
        newColors.push(color);
      }
    }

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
