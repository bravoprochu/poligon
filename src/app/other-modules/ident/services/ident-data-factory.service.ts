import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, pipe, throwError } from 'rxjs';
import { delay, finalize, retryWhen, takeWhile, tap } from 'rxjs/operators';
import { IS_HTTP_ERROR_RESPONSE_TO_RETRY } from 'commonFunctions/is-http-error-response-to-retry';
import { environment } from 'src/environments/environment';
import { IndicatorsService } from '../../indicators/indicators.service';
import { IIdentRegisterUser } from '../interfaces/i-ident-register-user';
import { IIdentUser } from '../interfaces/i-ident-user';
import { IUserToken } from '../interfaces/i-user-token';

const USER_REGISTER_RESPNSE = {
  PasswordRequiresLower: [
    "Passwords must have at least one lowercase ('a'-'z').",
  ],
  PasswordRequiresUpper: [
    "Passwords must have at least one uppercase ('A'-'Z').",
  ],
  PasswordRequiresNonAlphanumeric: [
    'Passwords must have at least one non alphanumeric character.',
  ],
};

const USER_TOKEN_MOCKED = {
  claims: [
    {
      type: 'sub',
      value: 'testowo@gmail.com',
    },
    {
      type: 'jti',
      value: 'c6e48acd-53dc-41e3-8940-09d3a4ead8e7',
    },
    {
      type: 'nameid',
      value: '329f5edb-6b24-4218-9845-a7fff5a29789',
    },
    {
      type: 'roles',
      value: 'Magazynier',
    },
    {
      type: 'roles',
      value: 'Administrator',
    },
  ],
  expirationTime: '2021-02-24T16:08:20.9763257+01:00',
  roles: ['Magazynier', 'Administrator'],
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJicmF2b3Byb2NodUBnbWFpbC5jb20iLCJqdGkiOiJjNmU0OGFjZC01M2RjLTQxZTMtODk0MC0wOWQzYTRlYWQ4ZTciLCJuYW1laWQiOiIzMjlmNWVkYi02YjI0LTQyMTgtOTg0NS1hN2ZmZjVhMjk3ODkiLCJyb2xlcyI6WyJNYWdhenluaWVyIiwiQWRtaW5pc3RyYXRvciJdLCJleHAiOjE2MTQxNzkzMDAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0IiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdCJ9.yYUGrJaZoni3lSaI7N9tC-0iIXuVIb3w_-eNUc65zk8',
} as IUserToken;

const RETRYWHEN_AND_FINALIZE_PIPE$ = (
  indicatorsService: IndicatorsService,
  repeats = environment.httpRequestRetry ?? 3,
  delayTime = environment.httpRequestRetryDelay ?? 2000
) =>
  pipe(
    retryWhen((err) =>
      err.pipe(
        tap(() => indicatorsService.setColorWarn()),
        delay(delayTime),
        takeWhile((resError: HttpErrorResponse, idx) => {
          if (
            idx < repeats &&
            IS_HTTP_ERROR_RESPONSE_TO_RETRY(resError.status)
          ) {
            indicatorsService.message(
              'Http request ERROR',
              `(${idx + 1}) Shit happens. ${
                idx + 1 === repeats ? '...last time!' : '...trying again'
              }`
            );
            return true;
          } else {
            indicatorsService.message(
              'Http request ERROR',
              `Error, ${resError.message}`
            );
            throw resError;
          }
        })
      )
    ),
    finalize(() => {
      indicatorsService.isInProgress$.next(false);
    })
  );

@Injectable({
  providedIn: 'root',
})
export class IdentDataFactoryService {
  constructor(
    private indicatorsService: IndicatorsService,
    private httpClient: HttpClient
  ) {}

  loginUser(identUser: IIdentUser): Observable<any> {
    this.initIndicator();
    /**
     * check if mocked data is correct
     *
     */
    if (
      identUser.userName === 'testowo@gmail.com' &&
      identUser.password === '123456'
    ) {
      const mockedUser = USER_TOKEN_MOCKED;
      /**
       * update expiration time
       *
       */
      mockedUser.expirationTime = new Date(
        new Date().getTime() + 2 * 60000
      ).toUTCString();

      return of(mockedUser).pipe(
        tap(() =>
          this.indicatorsService.message(
            'login user',
            'getting FAKED data from server..'
          )
        ),
        delay(environment.httpRequestRetryDelay),
        finalize(() => {
          this.indicatorsService.isInProgress$.next(false);
          this.indicatorsService.message('login user', 'You are logged in !!');
        })
      );
    }

    /**
     *
     *
     */
    return this.httpClient
      .post(environment.identTokenUrl, identUser)
      .pipe(RETRYWHEN_AND_FINALIZE_PIPE$(this.indicatorsService));
  }

  registerUser(identRegisterUser: IIdentRegisterUser): Observable<any> {
    this.initIndicator();

    if (
      identRegisterUser.userName === 'test@gmail.com' &&
      identRegisterUser.password === '123456'
    ) {
      return throwError(USER_REGISTER_RESPNSE).pipe(
        retryWhen((err) =>
          err.pipe(
            delay(2500),
            takeWhile((resError, idx) => {
              this.indicatorsService.message(
                'Http request ERROR',
                `Error, Error responed by server => invalid model `
              );
              const errorResp = new HttpErrorResponse({
                error: resError,
              });
              throw errorResp;
            })
          )
        ),
        finalize(() => {
          this.indicatorsService.isInProgress$.next(false);
        })
      );
    }

    return this.httpClient
      .post(environment.identRegisterUserUrl, identRegisterUser)
      .pipe(RETRYWHEN_AND_FINALIZE_PIPE$(this.indicatorsService));
  }

  private initIndicator(): void {
    this.indicatorsService.setColorPrimary();
    this.indicatorsService.isInProgress$.next(true);
  }
}
