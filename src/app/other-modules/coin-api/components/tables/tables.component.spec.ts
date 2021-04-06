import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoinApiModule } from 'otherModules/coin-api/coin-api.module';
import { CoinApiService } from 'otherModules/coin-api/services/coin-api.service';
import { of } from 'rxjs';

import { TablesComponent } from './tables.component';

describe('TablesComponent', () => {
  let component: TablesComponent;
  let fixture: ComponentFixture<TablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablesComponent],
      imports: [BrowserAnimationsModule, CoinApiModule],
      providers: [
        {
          provide: CoinApiService,
          useValue: {
            getExchanges$: () => of([]),
            getOrderBook$: () => of([]),
            getTradesMocked$: () => of([]),
            getQuotes$: () => of([]),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
