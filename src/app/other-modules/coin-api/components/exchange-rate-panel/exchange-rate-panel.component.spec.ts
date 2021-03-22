import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRatePanelComponent } from './exchange-rate-panel.component';

describe('ExchangeRatePanelComponent', () => {
  let component: ExchangeRatePanelComponent;
  let fixture: ComponentFixture<ExchangeRatePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRatePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRatePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
