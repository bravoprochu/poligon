import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDebugComponent } from './simple-debug.component';

describe('SimpleDebugComponent', () => {
  let component: SimpleDebugComponent;
  let fixture: ComponentFixture<SimpleDebugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleDebugComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
