import { AbstractControl, ValidatorFn } from '@angular/forms';

export const FORM_CONTROL_HAS_KEY_VALIDATOR = (key: string): ValidatorFn => {
  return (
    control: AbstractControl
  ): {
    [key: string]: any;
  } | null => {
    const forbidden = control.value && control.value[key];

    return forbidden ? null : { ControlHasNoKey: { value: key } };
  };
};
