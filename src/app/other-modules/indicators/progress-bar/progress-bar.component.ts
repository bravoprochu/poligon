import { Component, OnInit } from '@angular/core';
import { IndicatorsService } from '../indicators.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent implements OnInit {
  constructor(public indicatorsSrv: IndicatorsService) {}

  ngOnInit(): void {}
}
