import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe } from 'rxjs';
import { Observable, of, throwError, EmptyError } from 'rxjs';
import {
  catchError,
  delay,
  delayWhen,
  finalize,
  map,
  repeat,
  retryWhen,
  switchMap,
  take,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { isHttpErrorResponseToRetry } from 'src/app/common-functions/is-http-error-response-to-retry';
import { environment } from 'src/environments/environment';
import { IndicatorsService } from '../../indicators/indicators.service';
import { IIdentRegisterUser } from '../interfaces/i-ident-register-user';
import { IIdentUser } from '../interfaces/i-ident-user';

export const RETRYWHEN_AND_FINALIZE_PIPE$ = (
  indicatorsService: IndicatorsService,
  repeats = 3,
  delayTime = 2000
) => {
  return pipe(
    retryWhen((err) =>
      err.pipe(
        delay(delayTime),
        takeWhile((err: HttpErrorResponse, idx) => {
          if (idx < repeats && isHttpErrorResponseToRetry(err.status)) {
            indicatorsService.message(
              'Login ERROR',
              `(${idx + 1}) Shit happens. ${
                idx + 1 === repeats ? '...last time!' : '...trying again'
              }`
            );
            return true;
          } else {
            indicatorsService.message('Login ERROR', `Error, ${err.message}`);
            return false;
          }
        })
      )
    ),
    finalize(() => {
      indicatorsService.isInProgress$.next(false);
    })
  );
};

@Injectable({
  providedIn: 'root',
})
export class IdentDataFactoryService {
  constructor(
    private indicatorsService: IndicatorsService,
    private httpClient: HttpClient
  ) {}

  loginUser(identUser: IIdentUser): Observable<any> {
    return this.httpClient
      .post(environment.identTokenUrl, identUser)
      .pipe(tap(() => this.indicatorsService.isInProgress$.next(true)))
      .pipe(RETRYWHEN_AND_FINALIZE_PIPE$(this.indicatorsService));
  }

  registerUser(identRegisterUser: IIdentRegisterUser): Observable<any> {
    return this.httpClient
      .post(environment.identRegisterUserUrl, identRegisterUser)
      .pipe(RETRYWHEN_AND_FINALIZE_PIPE$(this.indicatorsService));
  }
}
