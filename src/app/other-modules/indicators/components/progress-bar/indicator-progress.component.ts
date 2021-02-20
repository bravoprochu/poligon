import { Component, OnInit } from '@angular/core';
import { IndicatorsService } from '../../indicators.service';

@Component({
  selector: 'app-indicator-progress',
  templateUrl: './indicator-progress.component.html',
  styleUrls: ['./indicator-progress.component.scss'],
})
export class IndicatorProgressComponent implements OnInit {
  constructor(public indicatorsSrv: IndicatorsService) {}

  ngOnInit(): void {}
}
