import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ILogError } from '../../interfaces/i-log-error';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.scss'],
})
export class ErrorLogComponent implements OnInit, OnDestroy {
  constructor(private logService: LogsService) {}

  errors = [] as ILogError[];
  isDestroyed$: Subject<boolean> = new Subject();
  itemHeight = 150;
  itemOnView = 3;

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initObservable();
  }

  initObservable(): void {
    this.logService.errors$.pipe(takeUntil(this.isDestroyed$)).subscribe(
      (errors: any) => {
        this.errors = [...errors];
      },
      (error) => console.log('errors error', error),
      () => console.log('errors completed..')
    );
  }
}
