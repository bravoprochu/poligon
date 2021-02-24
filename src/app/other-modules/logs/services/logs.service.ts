import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { ILogError } from '../interfaces/i-log-error';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  errors = [] as ILogError[];
  isErrorKept = true;
  isErrorAdded$ = new Subject() as Subject<boolean>;

  addMultiErrors(errors: string[], errorType: string): void {
    this.checkToClearErrors();

    const logErr = {} as ILogError;
    logErr.errors = [];
    logErr.date = this.getDate();
    logErr.type = errorType;

    errors.forEach((err) => logErr.errors.push(err));
    this.errors.unshift(logErr);
    this.isErrorAdded$.next(true);
  }

  addItemToErrors(errorItem: string, errorType: string): void {
    this.checkToClearErrors();
    const logErr = {} as ILogError;
    logErr.errors = [errorItem];
    logErr.date = this.getDate();
    logErr.type = errorType;

    this.errors.unshift(logErr);
    this.isErrorAdded$.next(true);
  }

  private checkToClearErrors(): void {
    if (!this.isErrorKept) {
      this.errors = [];
    }
  }

  private getDate(): string {
    return new Date().toUTCString();
  }
}
