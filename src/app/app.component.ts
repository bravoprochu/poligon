import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { IMenuItem } from 'src/app/other-modules/menu/interfaces/i-menu-item';
import { MatSidenav } from '@angular/material/sidenav';

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

  constructor(private breakpointObserver: BreakpointObserver) {}

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
  }

  ngAfterViewInit(): void {
    this.drawer.openedChange.pipe(takeUntil(this.isDestroyed$)).subscribe(
      (sideNavOpened: boolean) => {
        this.isOpened = sideNavOpened;
      },
      (error) => console.log('sideNavOpened error', error),
      () => console.log('sideNavOpened completed..')
    );
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
        route: ['/coin-api/list'],
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
}
