import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { IUserToken } from '../../interfaces/i-user-token';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss'],
})
export class UserStatusComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  isLoggedIn = false;
  isDestroyed$: Subject<boolean> = new Subject();

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initObservable();
  }

  initObservable(): void {
    this.loginService.isLoggedIn$
      .pipe(
        takeUntil(this.isDestroyed$),
        tap((isLoggedIn: boolean) => {
          this.isLoggedIn = isLoggedIn;
        })
      )
      .subscribe(
        (isLoggedIn: any) => {
          console.log('isLoggedIn subs:', isLoggedIn);
        },
        (error) => console.log('isLoggedIn error', error),
        () => console.log('isLoggedIn completed..')
      );
  }

  get loggedInUser(): IUserToken {
    return this.loginService.loggedInUser;
  }
}
