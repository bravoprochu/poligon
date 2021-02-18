import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndicatorsService {
  constructor(private snackBar: MatSnackBar) {}

  isInProgress$: Subject<boolean> = new Subject();
  progressColor$: BehaviorSubject<string> = new BehaviorSubject('primary');

  message(title: string, text: string, duration: number = 2500) {
    this.snackBar.open(text, title, {
      duration: duration,
    });
  }
}
