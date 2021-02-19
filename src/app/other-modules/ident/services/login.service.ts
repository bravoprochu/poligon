import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs/operators';
import { IndicatorsService } from '../../indicators/indicators.service';
import { IdentDataFactoryService } from './ident-data-factory.service';
import { IIdentRegisterUser } from '../interfaces/i-ident-register-user';
import { IIdentUser } from '../interfaces/i-ident-user';
import { IServerResponsePayload } from '../interfaces/i-server-response-payload';
import { RegisterFormValidator } from '../validators/register-form-validator';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private identDataFactory: IdentDataFactoryService,
    private indicatorsSrv: IndicatorsService
  ) {}

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
      userName: 'testowo@gmail.com',
      password: '123456',
    } as IIdentUser;
  }

  login(userForm$: FormGroup): void {
    if (userForm$.invalid) {
      return;
    }
    this.indicatorsSrv.isInProgress$.next(true);
    userForm$.disable();
    this.identDataFactory
      .loginUser(userForm$.value)
      .pipe(take(1))
      .subscribe(
        (loginResponse: IServerResponsePayload) => {
          console.log('loginResponse subs:', loginResponse);
          this.indicatorsSrv.isInProgress$.next(false);
          this.indicatorsSrv.message(
            `Logowanie - ${loginResponse.isError ? 'Błąd !' : 'OK !'}`,
            loginResponse.info,
            5000
          );
          userForm$.enable();
        },
        (error) => {
          this.indicatorsSrv.isInProgress$.next(false);
          console.log('_registerResponse error', error);
          userForm$.enable();
        },
        () => console.log('_registerResponse completed..')
      );
  }

  register(registerUser$: FormGroup): void {
    if (!registerUser$.valid) {
      return;
    }
    this.indicatorsSrv.isInProgress$.next(true);
    registerUser$.disable();
    this.identDataFactory
      .registerUser(registerUser$.value)
      .pipe(take(1))
      .subscribe(
        (registerResponse: IServerResponsePayload) => {
          console.log('registerResponse subs:', registerResponse);
          this.indicatorsSrv.isInProgress$.next(false);
          this.indicatorsSrv.message(
            `Rejestracja - ${registerResponse.isError ? 'Błąd !' : 'OK !'}`,
            registerResponse.info,
            5000
          );
          registerUser$.enable();
        },
        (error) => {
          this.indicatorsSrv.isInProgress$.next(false);
          console.log('_registerResponse error', error);
          registerUser$.enable();
        },
        () => console.log('_registerResponse completed..')
      );
  }
}
