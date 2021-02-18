import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IIdentRegisterUser } from '../interfaces/i-ident-register-user';
import { IIdentUser } from '../interfaces/i-ident-user';
import { IServerResponsePayload } from '../interfaces/i-server-response-payload';

@Injectable({
  providedIn: 'root',
})
export class IdentDataFactoryService {
  constructor(private httpClient: HttpClient) {}

  loginUser(identUser: IIdentUser): Observable<any> {
    return this.httpClient.post(environment.identTokenUrl, identUser, {}).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        const _errorPayload: IServerResponsePayload = {
          isError: true,
          info: 'problem serwerowy',
          payload: null,
        };
        return of(_errorPayload);
      })
    );
  }

  registerUser(identRegisterUser: IIdentRegisterUser): Observable<any> {
    return this.httpClient
      .post(environment.identRegisterUserUrl, identRegisterUser, {})
      .pipe(
        catchError((err) => {
          const _errorPayload: IServerResponsePayload = {
            isError: true,
            info: 'problem serwerowy',
            payload: null,
          };
          return of(_errorPayload);
        })
      );
  }
}
