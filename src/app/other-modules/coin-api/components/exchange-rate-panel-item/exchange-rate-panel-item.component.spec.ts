import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ExchangeRatePanelItemComponent } from './exchange-rate-panel-item.component';

describe('ExchangeRatePanelItemComponent', () => {
  let component: ExchangeRatePanelItemComponent;
  let fixture: ComponentFixture<ExchangeRatePanelItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExchangeRatePanelItemComponent],
      imports: [MatAutocompleteModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRatePanelItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
