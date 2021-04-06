import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IColorRangeDialogData } from 'otherModules/color-range/interfaces/i-color-range-dialog-data';
import { ColorRangeService } from 'otherModules/color-range/services/color-range.service';
import { CommonDialogsModule } from 'otherModules/dialogs/common-dialogs.module';

import { ColorChangeDialogComponent } from './color-change-dialog.component';

describe('ColorChangeDialogComponent', () => {
  let component: ColorChangeDialogComponent;
  let fixture: ComponentFixture<ColorChangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColorChangeDialogComponent],
      imports: [BrowserAnimationsModule, ReactiveFormsModule],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            data: {
              selectedColorRange: {
                color: 'red',
                max: 100,
                min: 0,
              },
            } as IColorRangeDialogData,
          },
        },
      ],
    }).compileComponents();
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
