import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const RegisterFormValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const rePassword = control.get('rePassword');

  return password && rePassword && password.value === rePassword.value
    ? null
    : { registerForm: 'password and rePassword dont match' };
};
