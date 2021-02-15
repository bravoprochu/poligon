import { Component, OnInit } from '@angular/core';
import { IMenuItem } from './other-modules/menu/interfaces/i-menu-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Poligon';
  menuItems = [] as IMenuItem[];

  ngOnInit(): void {
    this.initMenu();
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
