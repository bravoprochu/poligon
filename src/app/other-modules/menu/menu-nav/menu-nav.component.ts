import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  takeUntil,
} from 'rxjs/operators';
import { IMenuItem } from '../interfaces/i-menu-item';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-menu-nav',
  templateUrl: './menu-nav.component.html',
  styleUrls: ['./menu-nav.component.scss'],
})
export class MenuNavComponent implements OnInit, OnDestroy {
  @Input('menuItems') menuItems = [] as IMenuItem[];
  @Output() menuChanged = new EventEmitter();
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

  initMenuRoutes(): void {
    this.menuItems.forEach((f) => this.menuService.addToMenu(f));
  }

  initObservables(): void {
    /**
     * menu search$
     *
     */
    this.search$.valueChanges
      .pipe(
        takeUntil(this.isDestroyed$),
        startWith(null),
        debounceTime(750),
        distinctUntilChanged()
      )
      .subscribe(
        (search$: any) => {
          this.menuService.filterMenu(search$);
        },
        (error) => console.log('search$ error', error),
        () => console.log('search$ completed..')
      );
  }

  bookmark(item: IMenuItem): void {
    this.menuService.addToBookmark(item);
  }

  menuSelected(menuItem: IMenuItem): void {
    this.menuChanged.emit(menuItem);
  }

  remove(item: IMenuItem): void {
    this.menuService.removeFromBookmark(item);
  }

  get menu(): IMenuItem[] {
    return this.menuService.menu;
  }

  get bookmarked(): IMenuItem[] {
    return this.menuService.bookmark;
  }
}
