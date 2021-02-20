import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { IndicatorsService } from '../../indicators/indicators.service';
import { IdentDataFactoryService } from './ident-data-factory.service';
import { IIdentRegisterUser } from '../interfaces/i-ident-register-user';
import { IIdentUser } from '../interfaces/i-ident-user';
import { RegisterFormValidator } from '../validators/register-form-validator';
import { IUserToken } from '../interfaces/i-user-token';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private identDataFactory: IdentDataFactoryService,
    private indicatorsSrv: IndicatorsService
  ) {}

  isLoggedIn$ = new Subject<boolean>();

  getLoginForm$(fb: FormBuilder): FormGroup {
    const res = fb.group({
      userName: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });

    return res;
  }

  getRegisterForm$(fb: FormBuilder): FormGroup {
    const res = fb.group(
      {
        userName: new FormControl('', [Validators.required, Validators.email]),
        password: [null, [Validators.required]],
        rePassword: [null, Validators.required],
      },
      { validators: RegisterFormValidator }
    );

    return res;
  }

  getMockedRegisgerData(): IIdentRegisterUser {
    return {
      userName: 'test@gmail.com',
      password: '123456',
      rePassword: '123456',
    } as IIdentRegisterUser;
  }

  getMockedLoginData(): IIdentUser {
    return {
      userName: 'bravoprochu@gmail.com',
      password: 'Qq123456!',
    } as IIdentUser;
  }

  login(identUser: IIdentUser): Observable<IUserToken> {
    this.indicatorsSrv.isInProgress$.next(true);
    return this.identDataFactory.loginUser(identUser).pipe(
      tap((userToken) => {
        console.log('data retrived', userToken);
        this.tokenCheck(userToken);
      })
    );
  }

  register(registerUser: IIdentRegisterUser): Observable<any> {
    this.indicatorsSrv.isInProgress$.next(true);
    return this.identDataFactory.registerUser(registerUser);
  }

  private tokenCheck(userToken: IUserToken): void {
    if (!userToken.token) {
      return;
    }
    const now = new Date();
    const tokenTime = new Date(userToken.expirationTime);

    if (tokenTime >= now) {
      this.isLoggedIn$.next(true);
    } else {
      this.isLoggedIn$.next(false);
    }
  }
}
