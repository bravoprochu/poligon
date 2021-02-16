import { Injectable } from '@angular/core';
import { IMenuItem } from './interfaces/i-menu-item';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() {}

  activatedRoute = 'home';
  menu = [] as IMenuItem[];
  menuItemId = 0;
  menuOriginal = [] as IMenuItem[];
  bookmark = [] as IMenuItem[];

  addToMenu(menuItem: IMenuItem) {
    menuItem.id = this.menuItemId;
    this.menuItemId++;
    this.menuOriginal.push(menuItem);
  }

  addToBookmark(item: IMenuItem) {
    this.bookmark.push({ ...item } as IMenuItem);
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

  removeFromBookmark(item: IMenuItem) {
    const bookIdx = this.bookmark.indexOf(item);
    const menuItem = this.menu.find((f) => f.id == item.id);
    if (bookIdx > -1 && menuItem) {
      this.bookmark.splice(bookIdx, 1);
    }
  }
}
