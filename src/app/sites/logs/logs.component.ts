import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { YesNoDialogComponent } from 'src/app/other-modules/dialogs/components/yes-no-dialog/yes-no-dialog.component';
import { IYesNoDialogData } from 'src/app/other-modules/dialogs/interfaces/i-yes-no-dialog-data';
import { LogsService } from 'src/app/other-modules/logs/services/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit, OnDestroy {
  constructor(private matDialog: MatDialog, private logsService: LogsService) {}

  isDestroyed$: Subject<boolean> = new Subject();

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {}

  clearLogs(): void {
    this.matDialog
      .open(YesNoDialogComponent, {
        data: {
          title: 'Logs',
          question: 'Do You really want to clear logs ?',
        } as IYesNoDialogData,
      })
      .afterClosed()
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((yesNoDialog: any) => {
        if (yesNoDialog === true) {
          this.logsService.clearLogs();
        }
      });
  }
}
