import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPointChartComponent } from './svg-point-chart.component';

describe('SvgPointChartComponent', () => {
  let component: SvgPointChartComponent;
  let fixture: ComponentFixture<SvgPointChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgPointChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgPointChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
