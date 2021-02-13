import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IYesNoDialogData } from '../../interfaces/i-yes-no-dialog-data';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss'],
})
export class YesNoDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IYesNoDialogData) {}

  ngOnInit(): void {}
}
