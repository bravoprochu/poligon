import { Component, Input, OnInit } from '@angular/core';
import { ISvgChartInfoCard } from 'otherModules/svg-charts/interfaces/i-svg-chart-info-card';

@Component({
  selector: '[svg-chart-info-card]',
  templateUrl: './svg-chart-info-card.component.svg',
  styleUrls: ['./svg-chart-info-card.component.scss'],
})
export class SvgChartInfoCardComponent implements OnInit {
  @Input('infoCard') infoCard?: ISvgChartInfoCard;
  constructor() {}

  ngOnInit(): void {}
}
