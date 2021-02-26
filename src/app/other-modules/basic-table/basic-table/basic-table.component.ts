import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ContentChild,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Subject } from 'rxjs';
import { BasicTableDataSource } from '../basic-table-data-source';

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class BasicTableComponent<T>
  implements AfterViewInit, OnInit, OnDestroy {
  @Input('columnWidthDefault') columnWidthDefault = 175;
  @Input('dataSource')
  dataSource: BasicTableDataSource<T> = new BasicTableDataSource<T>();
  @Input('title') title = 'Material table';
  @Input('subtitle') subtitle = 'basic table';
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<T>;
  @ContentChild('expandedRow', { static: false })
  expandedRowRef?: TemplateRef<any>;
  expandedElement?: T | null;
  isDestroyed$: Subject<boolean> = new Subject();
  isExpandable = false;
  /**
   *
   */
  constructor() {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
