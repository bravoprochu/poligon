import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoinApiService } from 'otherModules/coin-api/services/coin-api.service';
import { ColorRangeService } from 'otherModules/color-range/services/color-range.service';

import { WebsocketsComponent } from './websockets.component';

describe('WebsocketsComponent', () => {
  let component: WebsocketsComponent;
  let fixture: ComponentFixture<WebsocketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebsocketsComponent],
      imports: [HttpClientModule],
      providers: [{ privide: CoinApiService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsocketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
