import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ILogError } from '../../interfaces/i-log-error';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.scss'],
})
export class ErrorLogComponent implements OnInit {
  constructor(private logService: LogsService) {}

  errors = [] as string[];
  itemHeight = 150;
  itemOnView = 3;

  ngOnInit(): void {
    this.initObservable();
  }

  initObservable() {
    this.logService.errors$.pipe().subscribe(
      (errors: any) => {
        console.log('errors subs:', errors);
        // this.errors = [];
        // this.errors = [...errors];
        this.errors = errors;
      },
      (error) => console.log('errors error', error),
      () => console.log('errors completed..')
    );
  }

  trackByFn(idx: number, item: ILogError): any {
    return idx;
  }
}
