export const CHECK_TYPE_IS_STRING = (value: any): value is string =>
  typeof value === 'string';

export const CHECK_TYPE_IS_NUMBER = (value: any): value is number =>
  typeof value === 'number';
