import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgChartInfoCardComponent } from './svg-chart-info-card.component';

describe('SvgChartInfoCardComponent', () => {
  let component: SvgChartInfoCardComponent;
  let fixture: ComponentFixture<SvgChartInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgChartInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgChartInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
