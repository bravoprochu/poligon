import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { tap } from 'rxjs/operators';
import { IndicatorsService } from '../../indicators/indicators.service';
import { IdentDataFactoryService } from './ident-data-factory.service';
import { IIdentRegisterUser } from '../interfaces/i-ident-register-user';
import { IIdentUser } from '../interfaces/i-ident-user';
import { RegisterFormValidator } from '../validators/register-form-validator';
import { IUserToken } from '../interfaces/i-user-token';
import { Observable, of, Subject } from 'rxjs';
import { UserClaimsEnums } from '../enums/user-claims-enums';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private identDataFactory: IdentDataFactoryService,
    private indicatorsSrv: IndicatorsService
  ) {}

  errors = [] as string[];
  isErrorKept = true;
  isLoggedIn$ = new Subject<boolean>();
  loggedInUser = {} as IUserToken;

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

  errorTypeHandler(error: HttpErrorResponse): void {
    if (!this.isErrorKept) {
      this.errors = [];
    }

    for (const [key, value] of Object.entries(error.error)) {
      const v = value;

      if (Array.isArray(value)) {
        value.forEach((v) => {
          this.errors.unshift(v);
        });
      } else {
        this.errors.unshift(value as string);
      }
    }
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

  loginErrorHandler(): void {}

  register(registerUser: IIdentRegisterUser): Observable<any> {
    this.indicatorsSrv.isInProgress$.next(true);
    return this.identDataFactory.registerUser(registerUser);
  }

  private mapUserToken(userToken: IUserToken): IUserToken {
    return {
      claims: userToken.claims.map((c) => {
        return {
          type: c.type,
          value: c.value,
        };
      }),
      expirationTime: userToken.expirationTime,
      roles: userToken.roles,
      token: userToken.token,
      userName: userToken.claims.find((f) => f.type === UserClaimsEnums.sub)
        ?.value,
    } as IUserToken;
  }

  private tokenCheck(userToken: IUserToken): void {
    if (!userToken.token) {
      return;
    }
    const now = new Date();
    const tokenTime = new Date(userToken.expirationTime);

    if (tokenTime >= now) {
      this.isLoggedIn$.next(true);
      this.loggedInUser = this.mapUserToken(userToken);
    } else {
      this.isLoggedIn$.next(false);
      this.loggedInUser = {} as IUserToken;
    }
  }
}
