import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentModule } from 'otherModules/ident/ident.module';

import { IndicatorProgressComponent } from './indicator-progress.component';

describe('ProgressBarComponent', () => {
  let component: IndicatorProgressComponent;
  let fixture: ComponentFixture<IndicatorProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndicatorProgressComponent],
      imports: [IdentModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
