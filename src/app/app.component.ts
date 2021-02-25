import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IMenuItem } from 'src/app/other-modules/menu/interfaces/i-menu-item';
import { MatSidenav } from '@angular/material/sidenav';
import { IS_HANDSET as IS_HANDSET } from './common-functions/is-handset';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('drawer', { static: false }) drawer!: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver) {}

  copyrights = 'bravoprochu 2021';
  menuItems = [] as IMenuItem[];
  isDestroyed$: Subject<boolean> = new Subject();
  isHandset$ = IS_HANDSET(this.breakpointObserver);
  isHandset = false;
  isOpened = false;
  title = 'Training - poligon';

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initMenu();
  }

  ngAfterViewInit(): void {
    this.initObservables();
  }

  initMenu(): void {
    this.menuItems = [
      {
        caption: 'home',
        icon: 'home',
        route: ['/home'],
      },
      {
        caption: 'login',
        icon: 'login',
        group: 'Ident/Auth',
        route: ['/identAuth'],
      },
      {
        caption: 'coin api service',
        group: 'coin API ',
        route: ['/coin-api/home'],
      },
      {
        caption: 'tables',
        group: 'coin API',
        icon: 'table_chart',
        route: ['/coin-api/tables'],
      },
      {
        caption: 'websockets',
        icon: 'analytics',
        group: 'coin API',
        route: ['/coin-api/websockets'],
      },
      {
        caption: 'logs',
        icon: 'wysiwyg',
        group: 'System/logs',
        route: ['/logs'],
      },
    ] as IMenuItem[];
  }

  initObservables(): void {
    /**
     * sidenav drawer open
     *
     */
    this.drawer.openedChange.pipe(takeUntil(this.isDestroyed$)).subscribe(
      (sideNavOpened: boolean) => {
        this.isOpened = sideNavOpened;
      },
      (error) => console.log('sideNavOpened error', error),
      () => console.log('sideNavOpened completed..')
    );

    /**
     * isHandset
     *
     */
    this.isHandset$.pipe(takeUntil(this.isDestroyed$)).subscribe(
      (isHandset: any) => {
        this.isHandset = isHandset;
      },
      (error) => console.log('isHandset error', error),
      () => console.log('isHandset completed..')
    );
  }

  menuSelected(ev: IMenuItem | boolean): void {
    if (this.isHandset === true) {
      this.drawer.close();
    }
  }
}
