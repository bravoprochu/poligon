import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { IndicatorsService } from '../../indicators/indicators.service';
import { LoginService } from '../services/login.service';

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
    this.loginService.login(this.rFormLogin);
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
