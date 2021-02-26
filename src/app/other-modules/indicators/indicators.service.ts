import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndicatorsService {
  isInProgress$: Subject<boolean> = new Subject();
  progressColor = 'primary';

  constructor(private snackBar: MatSnackBar) {}

  message(title: string, text: string, duration: number = 2500): void {
    this.snackBar.open(text, title, {
      duration: duration,
    });
  }

  setColorAccent(): void {
    this.progressColor = 'accent';
  }

  setColorPrimary(): void {
    this.progressColor = 'primary';
  }

  setColorWarn(): void {
    this.progressColor = 'warn';
  }
}
