import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import {
  delay,
  finalize,
  retryWhen,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { isHttpErrorResponseToRetry } from 'src/app/common-functions/is-http-error-response-to-retry';
import { environment } from 'src/environments/environment';
import { IndicatorsService } from '../../indicators/indicators.service';
import { IIdentRegisterUser } from '../interfaces/i-ident-register-user';
import { IIdentUser } from '../interfaces/i-ident-user';

const RETRYWHEN_AND_FINALIZE_PIPE$ = (
  indicatorsService: IndicatorsService,
  repeats = 3,
  delayTime = 2000
) => {
  return pipe(
    retryWhen((err) =>
      err.pipe(
        tap(() => indicatorsService.setColorWarn()),
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
            throw err;
            // return false;
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
    this.initIndicator();
    return this.httpClient
      .post(environment.identTokenUrl, identUser)
      .pipe(RETRYWHEN_AND_FINALIZE_PIPE$(this.indicatorsService));
  }

  registerUser(identRegisterUser: IIdentRegisterUser): Observable<any> {
    this.initIndicator();

    return this.httpClient
      .post(environment.identRegisterUserUrl, identRegisterUser)
      .pipe(RETRYWHEN_AND_FINALIZE_PIPE$(this.indicatorsService));
  }

  private initIndicator(): void {
    this.indicatorsService.setColorPrimary();
    this.indicatorsService.isInProgress$.next(true);
  }
}
