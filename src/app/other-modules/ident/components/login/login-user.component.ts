import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { IndicatorsService } from '../../../indicators/indicators.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  formErrors = [] as string[];
  hideLoginPassword = true;
  rFormLogin = {} as FormGroup;
  isDestroyed$: Subject<boolean> = new Subject();

  constructor(
    @Optional() private dialogRef: MatDialogRef<LoginComponent>,
    private fb: FormBuilder,
    private indicatorsSrv: IndicatorsService,
    private loginService: LoginService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();
    this.initMockData();
  }

  initForm(): void {
    this.rFormLogin = this.loginService.getLoginForm$(this.fb);
  }

  initMockData(): void {
    const LOGINDATA = this.loginService.getMockedLoginData();
    this.rFormLogin.setValue(LOGINDATA);
  }

  login(): void {
    if (this.rFormLogin.invalid) {
      return;
    }
    this.formErrors = [];
    this.rFormLogin.disable();
    this.loginService
      .login(this.rFormLogin.value)
      .pipe(
        finalize(() => this.rFormLogin.enable()),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(
        (loginResponse: any) => {
          console.log('loginResponse subs:', loginResponse.token);
          if (this.dialogRef) {
            this.dialogRef.close(true);
          }
        },
        (error: HttpErrorResponse) => {
          const fixedErrors = this.loginService.getErrorMessage(error);
          this.formErrors = [...fixedErrors];
          this.loginService.addToLogs(fixedErrors, 'loginUser');
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
