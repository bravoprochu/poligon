import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-error',
  templateUrl: './simple-error.component.html',
  styleUrls: ['./simple-error.component.scss'],
})
export class SimpleErrorComponent implements OnInit {
  @Input('errors') errors = [] as string[];
  constructor() {}

  ngOnInit(): void {}
}
