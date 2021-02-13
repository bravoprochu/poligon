import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorChangeDialogComponent } from './color-change-dialog.component';

describe('ColorChangeDialogComponent', () => {
  let component: ColorChangeDialogComponent;
  let fixture: ComponentFixture<ColorChangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorChangeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
