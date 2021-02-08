import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinApiComponent } from './coin-api.component';

describe('CoinApiComponent', () => {
  let component: CoinApiComponent;
  let fixture: ComponentFixture<CoinApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoinApiComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
