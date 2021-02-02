import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinApiQuotesComponent } from './coin-api-quotes.component';

describe('CoinApiQuotesComponent', () => {
  let component: CoinApiQuotesComponent;
  let fixture: ComponentFixture<CoinApiQuotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinApiQuotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinApiQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
