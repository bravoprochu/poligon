import { TestBed } from '@angular/core/testing';

import { RxjsWebsocketService } from './rxjs-websocket.service';

describe('RxjsWebsocketService', () => {
  let service: RxjsWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxjsWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
