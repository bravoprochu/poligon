import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ILogError } from '../interfaces/i-log-error';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  constructor() {}

  private errors = [] as ILogError[];
  errors$ = new Subject() as Subject<ILogError[]>;
  isErrorKept = true;
  isErrorAdded$ = new Subject() as Subject<boolean>;

  addMultiErrors(errors: string[], errorType: string) {
    this.checkToClearErrors();

    const logErr = {} as ILogError;
    logErr.errors = [];
    logErr.date = new Date().toUTCString();
    logErr.type = errorType;

    errors.push('what the fuck for start');
    errors.forEach((err) => logErr.errors.push(err));
    errors.push('what the fuck for end');
    this.errors.unshift(logErr);
    this.errors$.next(this.errors);

    console.log(this.errors);
  }

  addItemToErrors(errorItem: string, errorType: string): void {
    this.checkToClearErrors();

    const logErr = {} as ILogError;
    logErr.errors = [];
    logErr.date = new Date().toLocaleString();
    logErr.type = errorType;

    this.errors.unshift(logErr);
    this.errors$.next(this.errors);
  }

  private checkToClearErrors(): void {
    if (!this.isErrorKept) {
      this.errors = [];
    }
  }
}
