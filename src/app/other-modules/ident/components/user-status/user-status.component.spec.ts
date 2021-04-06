import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentModule } from 'otherModules/ident/ident.module';
import { LoginService } from 'otherModules/ident/services/login.service';

import { UserStatusComponent } from './user-status.component';

describe('UserStatusComponent', () => {
  let component: UserStatusComponent;
  let fixture: ComponentFixture<UserStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserStatusComponent],
      imports: [IdentModule],
      providers: [
        {
          provide: LoginService,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
