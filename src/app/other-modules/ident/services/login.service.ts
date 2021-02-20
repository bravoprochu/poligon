import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { IndicatorsService } from '../../indicators/indicators.service';
import { IdentDataFactoryService } from './ident-data-factory.service';
import { IIdentRegisterUser } from '../interfaces/i-ident-register-user';
import { IIdentUser } from '../interfaces/i-ident-user';
import { RegisterFormValidator } from '../validators/register-form-validator';
import { IUserToken } from '../interfaces/i-user-token';

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

  login(loginForm$: FormGroup): void {
    if (loginForm$.invalid) {
      return;
    }
    this.indicatorsSrv.isInProgress$.next(true);
    loginForm$.disable();
    this.identDataFactory
      .loginUser(loginForm$.value)
      .pipe(
        finalize(() => {
          loginForm$.enable();
        })
      )
      .subscribe((loginResponse: IUserToken) => {
        console.log('loginResponse subs:', loginResponse.token);
      });
  }

  register(registerForm$: FormGroup): void {
    if (!registerForm$.valid) {
      return;
    }
    this.indicatorsSrv.isInProgress$.next(true);
    registerForm$.disable();
    this.identDataFactory
      .registerUser(registerForm$.value)
      .pipe(
        finalize(() => {
          registerForm$.enable();
        })
      )
      .subscribe((loginResponse: IUserToken) => {
        console.log('loginResponse subs:', loginResponse.token);
      });
  }
}
