import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IndicatorsService } from '../../../indicators/indicators.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private indicatorsSrv: IndicatorsService,
    private loginService: LoginService
  ) {}

  hideLoginPassword = true;
  rFormLogin = {} as FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.initMockData();
  }

  initForm(): void {
    this.rFormLogin = this.loginService.getLoginForm$(this.fb);
  }

  initMockData(): void {
    const _LOGINDATA = this.loginService.getMockedLoginData();
    this.rFormLogin.setValue(_LOGINDATA);
  }

  login(): void {
    if (this.rFormLogin.invalid) {
      return;
    }
    this.rFormLogin.disable();
    this.loginService
      .login(this.rFormLogin.value)
      .pipe(finalize(() => this.rFormLogin.enable()))
      .subscribe(
        (loginResponse: any) => {
          console.log('loginResponse subs:', loginResponse.token);
        },
        (error: HttpErrorResponse) => {
          console.log('login componen on Error...', error);
          this.loginService.errorTypeHandler(error.error?.payload, 'loginUser');
        }
      );
  }

  get isInProgress$(): Subject<boolean> {
    return this.indicatorsSrv.isInProgress$;
  }

  get loginEmail(): FormControl {
    return this.rFormLogin.get('userName') as FormControl;
  }

  get loginPassword(): FormControl {
    return this.rFormLogin.get('password') as FormControl;
  }
}
