import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  startWith,
  takeUntil,
  throttleTime,
} from 'rxjs/operators';
import { IMenuItem } from '../interfaces/i-menu-item';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-menu-nav',
  templateUrl: './menu-nav.component.html',
  styleUrls: ['./menu-nav.component.scss'],
})
export class MenuNavComponent implements OnInit {
  @Input('menuItems') menuItems = [] as IMenuItem[];
  constructor(private menuService: MenuService) {}

  isDestroyed$: Subject<boolean> = new Subject();
  search$: FormControl = new FormControl();

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initMenuRoutes();
    this.initObservables();
  }

  initMenuRoutes() {
    this.menuItems.forEach((f) => this.menuService.addToMenu(f));
  }

  initObservables() {
    this.search$.valueChanges
      .pipe(
        takeUntil(this.isDestroyed$),
        startWith(null),
        throttleTime(750),
        distinctUntilChanged()
      )
      .subscribe(
        (search$: any) => {
          console.log('search$ subs:', search$);
          this.menuService.filterMenu(search$);
        },
        (error) => console.log('search$ error', error),
        () => console.log('search$ completed..')
      );
  }

  bookmark(item: IMenuItem) {
    item.isBookmarked = true;
  }

  remove(item: IMenuItem) {
    item.isBookmarked = false;
  }

  get menu(): IMenuItem[] {
    return this.menuService.menu;
  }

  get bookmarked(): IMenuItem[] {
    return this.menuService.menu.filter((f) => f.isBookmarked);
  }
}
