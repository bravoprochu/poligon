import { Injectable } from '@angular/core';
import { IMenuItem } from './interfaces/i-menu-item';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() {}

  menu = [] as IMenuItem[];
  menuOriginal = [] as IMenuItem[];

  addToMenu(menuItem: IMenuItem) {
    this.menuOriginal.push(menuItem);
  }

  filterMenu(searchPhrase: string) {
    if (!searchPhrase || searchPhrase.length == 0) {
      this.menu = [...this.menuOriginal];
      return;
    }
    this.menu = [...this.menuOriginal].filter((f) => {
      const text = (f.caption + f.info + f.group).toLowerCase();
      if (text.includes(searchPhrase.toLowerCase())) {
        return f;
      }
      return;
    });
  }
}
