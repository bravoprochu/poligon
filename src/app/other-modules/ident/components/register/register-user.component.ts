import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IndicatorsService } from 'src/app/other-modules/indicators/indicators.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private indicatorsSrv: IndicatorsService,
    private loginService: LoginService
  ) {}

  hideRegisterPassword = true;
  hideRegisterRePassword = true;
  rFormRegister = {} as FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.initMockData();
  }

  initForm(): void {
    this.rFormRegister = this.loginService.getRegisterForm$(this.fb);
  }

  initMockData(): void {
    const _REGISTER_DATA = this.loginService.getMockedRegisgerData();
    this.rFormRegister.setValue(_REGISTER_DATA);
  }

  register(): void {
    if (this.rFormRegister.invalid) {
      return;
    }

    this.rFormRegister.disable();
    this.loginService
      .register(this.rFormRegister.value)
      .pipe(finalize(() => this.rFormRegister.enable()))
      .subscribe(
        (loginResponse: any) => {
          console.log('loginResponse subs:', loginResponse);
        },
        (error: HttpErrorResponse) => {
          this.loginService.errorTypeHandler(error.error, 'registerUser');
        }
      );
  }

  get isInProgress$(): Subject<boolean> {
    return this.indicatorsSrv.isInProgress$;
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
