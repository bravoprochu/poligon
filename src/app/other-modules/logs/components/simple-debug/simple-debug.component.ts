import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-simple-debug',
  templateUrl: './simple-debug.component.html',
  styleUrls: ['./simple-debug.component.scss'],
})
export class SimpleDebugComponent implements OnInit {
  @Input('rForm$') rForm$!: FormGroup | FormControl | FormArray;

  constructor() {}

  ngOnInit(): void {}

  hitToConsole(): void {
    console.warn(this.rForm$);
  }
}
