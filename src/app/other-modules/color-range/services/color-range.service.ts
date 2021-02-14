import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IColorRangeItem } from '../interfaces/i-color-range-item';

@Injectable({
  providedIn: 'root',
})
export class ColorRangeService {
  constructor() {}

  colorRanges = [] as IColorRangeItem[];

  addNewColorRange() {
    const last = this.getLastColorRange();
    this.addToRange(last.color, last.max + 200);
  }

  addToRange(color: string, max: number) {
    const lastMax =
      this.colorRanges.length > 0
        ? this.colorRanges[this.colorRanges.length - 1].max
        : 0;
    if (lastMax >= max) {
      return;
    }

    this.colorRanges.push({
      color: color,
      max: max,
      min: lastMax,
    } as IColorRangeItem);
  }

  removeFromRange(color: IColorRangeItem) {
    const idx = this.colorRanges.indexOf(color);
    if (this.colorRanges.length > 1 && idx > -1) {
      this.colorRanges.splice(idx, 1);
    }
    this.fixRightContinuity();
  }

  getColorForm$(fb: FormBuilder): FormGroup {
    return fb.group({
      max: [null, Validators.required],
      min: [null, Validators.required],
      color: [null, Validators.required],
    });
  }

  getColorByValue(value: number, defaultColor = 'white'): string {
    const color = this.getRangeBasedOnValue(value);
    return color.color ? color.color : defaultColor;
  }

  getRangeBasedOnValue(value: number): IColorRangeItem {
    let res = {} as IColorRangeItem;
    for (let index = 0; index < this.colorRanges.length; index++) {
      const color = this.colorRanges[index];

      if (value >= color.min && value <= color.max) {
        res = color;
        break;
      }
    }
    return res;
  }

  getLastColorRange(): IColorRangeItem {
    return this.colorRanges[this.colorRanges.length - 1];
  }

  fixRightContinuity() {
    /**
     * to keep continuity
     * current max is next min..
     *
     */
    for (let index = 0; index < this.colorRanges.length; index++) {
      const color = this.colorRanges[index];

      const idxNext = index + 1;
      if (idxNext < this.colorRanges.length) {
        color.max = this.colorRanges[idxNext].min;
      }
    }
  }

  fixColorRanges(selected: IColorRangeItem, range: IColorRangeItem) {
    let min = range.min;
    const oldRangeMin = this.colorRanges[0].min;
    const max = range.max;
    const oldRangeMax = this.colorRanges[this.colorRanges.length - 1].max;
    const newColor = selected!.color;

    let newColors = [] as IColorRangeItem[];

    /**
     * PRE
     * special case
     *  one set only values are larger then any actual min/max
     *
     */

    if (min <= oldRangeMin && max >= oldRangeMax) {
      newColors.push({
        color: newColor,
        min: min,
        max: max,
      } as IColorRangeItem);
      this.colorRanges = newColors;
      return;
    }

    /**
     * PRE
     * special case
     * extand actual items on LEFT side
     *
     */
    if (min < oldRangeMin && max < oldRangeMax) {
      this.colorRanges.unshift({
        color: newColor,
        min: min,
        max: oldRangeMin,
      } as IColorRangeItem);
    }

    /**
     * PRE
     * special case
     * extand actual items on RIGHT side
     *
     */
    if (max > oldRangeMax && min > oldRangeMin) {
      this.colorRanges.unshift({
        color: newColor,
        min: oldRangeMax,
        max: max,
      } as IColorRangeItem);
    }

    for (let index = 0; index < this.colorRanges.length; index++) {
      const color = this.colorRanges[index];

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
    this.colorRanges = newColors;
  }
}
