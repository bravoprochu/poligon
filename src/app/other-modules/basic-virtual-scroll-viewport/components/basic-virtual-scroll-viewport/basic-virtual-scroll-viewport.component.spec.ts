import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicVirtualScrollViewportComponent } from './basic-virtual-scroll-viewport.component';

describe('BasicVirtualScrollViewportComponent', () => {
  let component: BasicVirtualScrollViewportComponent;
  let fixture: ComponentFixture<BasicVirtualScrollViewportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicVirtualScrollViewportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicVirtualScrollViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
