import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IColorRangeItem } from '../interfaces/i-color-range-item';

@Injectable({
  providedIn: 'root',
})
export class ColorRangeService {
  constructor() {}

  checkUp(v: number, arr: IColorRangeItem[], startIndex = 0): IColorRangeItem {
    let res = arr[arr.length - 1];
    for (let i = startIndex; i < arr.length; i++) {
      const color = arr[i];
      if (v >= color.min && v <= color.max) {
        res = color;
        break;
      }
    }
    return res;
  }

  checkDown(
    v: number,
    arr: IColorRangeItem[],
    startIndex?: number
  ): IColorRangeItem {
    let res = arr[0];
    startIndex = startIndex ? startIndex : arr.length - 1;
    for (let i = startIndex; i >= 0; i--) {
      const color = arr[i];
      if (v >= color.min && v <= color.max) {
        res = color;
        break;
      }
    }
    return res;
  }

  getColorForm$(fb: FormBuilder): FormGroup {
    return fb.group({
      max: [null, Validators.required],
      min: [null, Validators.required],
      color: [null, Validators.required],
    });
  }
}
