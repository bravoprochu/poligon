import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { IndicatorsService } from 'otherModules/indicators/indicators.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit, OnDestroy {
  formErrors = [] as string[];
  hideRegisterPassword = true;
  hideRegisterRePassword = true;
  rFormRegister = {} as FormGroup;
  isDestroyed$: Subject<boolean> = new Subject();

  constructor(
    @Optional() private dialogRef: MatDialogRef<RegisterUserComponent>,
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
    this.rFormRegister = this.loginService.getRegisterForm$(this.fb);
  }

  initMockData(): void {
    const REGISTER_DATA = this.loginService.getMockedRegisgerData();
    this.rFormRegister.setValue(REGISTER_DATA);
  }

  register(): void {
    if (this.rFormRegister.invalid) {
      return;
    }
    this.formErrors = [];
    this.rFormRegister.disable();
    this.loginService
      .register(this.rFormRegister.value)
      .pipe(
        finalize(() => this.rFormRegister.enable()),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(
        (loginResponse: any) => {
          this.formErrors = [];
        },
        (error: HttpErrorResponse) => {
          const fixedErrors = this.loginService.getErrorMessage(error);
          this.formErrors = [...fixedErrors];
          this.loginService.addToLogs(fixedErrors, 'registerUser');
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
