import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RxjsWebsocketsComponent } from './rxjs-websockets.component';

describe('RxjsWebsocketsComponent', () => {
  let component: RxjsWebsocketsComponent;
  let fixture: ComponentFixture<RxjsWebsocketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RxjsWebsocketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RxjsWebsocketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
