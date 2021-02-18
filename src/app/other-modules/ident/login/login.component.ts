import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { IndicatorsService } from '../../indicators/indicators.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private indicatorsSrv: IndicatorsService,
    private loginService: LoginService
  ) {}

  hideLoginPassword: boolean = true;
  hideRegisterPassword: boolean = true;
  hideRegisterRePassword: boolean = true;
  rFormLogin = {} as FormGroup;
  rFormRegister = {} as FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.initMockData();
  }

  initForm(): void {
    this.rFormLogin = this.loginService.getLoginForm$(this.fb);
    this.rFormRegister = this.loginService.getRegisterForm$(this.fb);
  }

  initMockData(): void {
    const _REGISTER_DATA = this.loginService.getMockedRegisgerData();
    this.rFormRegister.setValue(_REGISTER_DATA);

    const _LOGINDATA = this.loginService.getMockedLoginData();
    this.rFormLogin.setValue(_LOGINDATA);
  }

  login(): void {
    this.loginService.login(this.rFormLogin);
  }

  register(): void {
    console.log('register', this.rFormRegister.value);
    this.loginService.register(this.rFormRegister);
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

  get registerEmail(): FormControl {
    return this.rFormRegister.get('userName') as FormControl;
  }

  get registerPassword(): FormControl {
    return this.rFormRegister.get('password') as FormControl;
  }

  get registerRePassword(): FormControl {
    return this.rFormRegister.get('rePassword') as FormControl;
  }
}
