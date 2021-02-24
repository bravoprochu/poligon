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
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { UserClaimsEnums } from '../enums/user-claims-enums';
import { HttpErrorResponse } from '@angular/common/http';
import { LogsService } from '../../logs/services/logs.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private identDataFactory: IdentDataFactoryService,
    private indicatorsSrv: IndicatorsService,
    private logService: LogsService
  ) {}

  isLoggedIn$ = new ReplaySubject<boolean>();
  isLoggedIn = false;
  loggedInUser = {} as IUserToken;

  addToLogs(errors: string | string[], logsTitle: string): void {
    if (Array.isArray(errors)) {
      this.logService.addMultiErrors(errors, logsTitle);
    } else {
      this.logService.addItemToErrors(errors, logsTitle);
    }
  }

  getLoginForm$(fb: FormBuilder): FormGroup {
    const res = fb.group({
      userName: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });

    return res;
  }

  getErrorMessage(err: HttpErrorResponse): string[] {
    /**
     * deffensive:
     * if has not error object or no server response
     *
     */
    if (!err.error || err.error instanceof ProgressEvent) {
      return [err.message];
    }
    /**
     * errors as array of strings
     * or as key/value pair dictionary
     * + extra if value is array
     *
     */
    if (err.error && Array.isArray(err)) {
      return err.error;
    }

    const resArr = [] as string[];
    for (const [key, value] of Object.entries(err.error)) {
      const objValue = value;

      if (Array.isArray(objValue)) {
        objValue.forEach((v) => {
          resArr.push(v);
        });
      } else {
        resArr.push(objValue as string);
      }
    }
    return resArr;
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
      userName: 'testowo@gmail.com',
      password: '',
    } as IIdentUser;
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

  login(identUser: IIdentUser): Observable<IUserToken> {
    this.indicatorsSrv.isInProgress$.next(true);
    this.isLoggedIn = true;
    return this.identDataFactory.loginUser(identUser).pipe(
      tap((userToken) => {
        this.tokenCheck(userToken);
      })
    );
  }

  logout(): void {
    this.isLoggedIn$.next(false);
    this.isLoggedIn = true;
    this.loggedInUser = {} as IUserToken;
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
