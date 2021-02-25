import { Injectable, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { IndicatorsService } from '../../indicators/indicators.service';
import { IdentDataFactoryService } from './ident-data-factory.service';
import { IIdentRegisterUser } from '../interfaces/i-ident-register-user';
import { IIdentUser } from '../interfaces/i-ident-user';
import { RegisterFormValidator } from '../validators/register-form-validator';
import { IUserToken } from '../interfaces/i-user-token';
import { interval, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { UserClaimsEnums } from '../enums/user-claims-enums';
import { HttpErrorResponse } from '@angular/common/http';
import { LogsService } from '../../logs/services/logs.service';
import { LocalStorageService } from '../../local-storage/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService implements OnDestroy {
  constructor(
    private identDataFactory: IdentDataFactoryService,
    private indicatorsSrv: IndicatorsService,
    private logService: LogsService,
    private storageService: LocalStorageService
  ) {
    this.initStorageToken();
    this.initObservables();
  }

  isLoggingStatusChanged$ = new ReplaySubject<boolean>();
  isLoggedIn = false;
  loggedInUser = {} as IUserToken;
  isDestroyed$: Subject<boolean> = new Subject();

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

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
      password: '123456',
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

  initObservables(): void {
    this.isLoggingStatusChanged$
      .pipe(
        switchMap((isLoggedin: boolean) => {
          /**
           * update or remove token saved to storage
           *
           */
          this.tokenToStorage();
          if (isLoggedin) {
            return interval(1000).pipe(
              tap(() => {
                this.tokenCheck(this.loggedInUser);
              })
            );
          } else {
            this.indicatorsSrv.message(
              'Identity session',
              'Current session has timed out. Need to log in',
              3000
            );
            return of('not loggedIn');
          }
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(
        (tokenIntervalCheck: any) => {
          console.log('tokenIntervalCheck subs:', tokenIntervalCheck);
        },
        (error) => console.log('tokenIntervalCheck error', error),
        () => console.log('tokenIntervalCheck completed..')
      );
  }

  initStorageToken(): void {
    const token = this.storageService.get('userInfo');
    if (token) {
      this.tokenCheck(token);
    }
  }

  login(identUser: IIdentUser): Observable<IUserToken> {
    this.indicatorsSrv.isInProgress$.next(true);
    return this.identDataFactory.loginUser(identUser).pipe(
      tap((userToken) => {
        this.tokenCheck(userToken);
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.loggedInUser = {} as IUserToken;
    this.isLoggingStatusChanged$.next(false);
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
      this.isLoggedIn = false;
      this.isLoggingStatusChanged$.next(false);
      return;
    }
    const now = new Date();
    const tokenTime = new Date(userToken.expirationTime);

    if (tokenTime >= now) {
      this.isLoggedIn = true;
      this.loggedInUser = this.mapUserToken(userToken);
      this.isLoggingStatusChanged$.next(true);
    } else {
      this.isLoggedIn = false;
      this.loggedInUser = {} as IUserToken;
      this.isLoggingStatusChanged$.next(false);
    }
  }

  private tokenToStorage(): void {
    /**
     * save to localstorage or remove if not logged in
     *
     */
    if (this.isLoggedIn) {
      this.storageService.set('userInfo', this.loggedInUser);
    } else {
      this.storageService.remove('userInfo');
    }
  }
}
