import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { ColorRangeComponent } from './color-range.component';

describe('ColorRangeComponent', () => {
  let component: ColorRangeComponent;
  let fixture: ComponentFixture<ColorRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColorRangeComponent],
      providers: [{ provide: MatDialog, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
