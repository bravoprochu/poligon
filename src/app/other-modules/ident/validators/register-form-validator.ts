import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const REGISTER_FORM_VALIDATOR: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const rePassword = control.get('rePassword');

  return password && rePassword && password.value === rePassword.value
    ? null
    : { registerForm: 'password and rePassword dont match' };
};
