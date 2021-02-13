import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { IColorRangeItem } from '../interfaces/i-color-range-item';
import { ColorRangeService } from '../services/color-range.service';

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

  colorGrade$: FormControl = new FormControl();
  isDestroyed$: Subject<boolean> = new Subject();
  isEditMode: boolean = false;
  rForm!: FormGroup;

  ngOnInit(): void {
    this.initColors();
    this.initForms();
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
    this.colorService.addToRange('#E72DFC', 200);
    this.colorService.addToRange('#D9279F', 400);
    this.colorService.addToRange('#F03756', 500);
    this.colorService.addToRange('#D95C4E', 600);
    this.colorService.addToRange('#FC8B65', 1500);
    this.colorService.addToRange('#cB8B65', 2000);
    this.colorService.addToRange('#DB8B65', 2400);
  }

  initForms() {
    this.rForm = this.colorService.getColorForm$(this.fb);
  }

  removeColor() {
    if (this.colorSelected) {
      this.colorService.removeFromRange(this.colorSelected!);
    }
    this.colorSelected = undefined;
    this.isEditMode = false;
  }

  updateColor() {
    this.colorService.fixColorRanges(this.colorSelected!, this.rForm.value);
  }

  updateSelectedColorValues() {
    /**
     * set values from form (update curernt)
     *
     */
    this.colorSelected!.max = (this.rForm.value as IColorRangeItem).max;
    this.colorSelected!.min = (this.rForm.value as IColorRangeItem).min;
  }

  get colors(): IColorRangeItem[] {
    return this.colorService.colorRanges;
  }
}
