import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IdentModule } from '../ident.module';
import { LoginService } from '../services/login.service';
import { IdentifyGuard } from './identify.guard';

describe('IdentifyGuard', () => {
  let guard: IdentifyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IdentModule],
      providers: [
        { provide: LoginService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    });
    guard = TestBed.inject(IdentifyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
