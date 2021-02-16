import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';
import { IMenuItem } from 'src/app/other-modules/menu/interfaces/i-menu-item';
import { MatSidenav } from '@angular/material/sidenav';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { MenuService } from './other-modules/menu/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer', { static: false }) drawer!: MatSidenav;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private menuService: MenuService
  ) {}

  copyrights = 'bravoprochu 2021';
  menuItems = [] as IMenuItem[];
  isDestroyed$: Subject<boolean> = new Subject();
  isOpened = false;
  title = 'poligon';

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initMenu();
    this.initExtraMenu();
  }

  ngAfterViewInit(): void {
    this.initObservables();
  }

  initMenu() {
    this.menuItems = [
      {
        caption: 'home',
        icon: 'home',
        route: ['/home'],
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
    ] as IMenuItem[];
  }

  initExtraMenu() {
    this.menuItems = [
      ...this.menuItems,
      ...this.menuItems.map((m) => {
        let newItem = { ...m };
        newItem.caption = newItem.caption + 'and ' + 1;
        return newItem;
      }),
    ];

    this.menuItems = [
      ...this.menuItems,
      ...this.menuItems.map((m) => {
        let newItem = { ...m };
        newItem.caption = newItem.caption + 'and ' + 2;
        return newItem;
      }),
    ];
  }

  initObservables() {
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
  }
}
