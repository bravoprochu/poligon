import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { repeat, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { LoginComponent } from '../components/login/login-user.component';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root',
})
export class IdentifyGuard implements CanLoad {
  /**
   *
   */
  constructor(
    private matDialog: MatDialog,
    private loginService: LoginService
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.loginService.isLoggedIn) {
      return this.matDialog
        .open(LoginComponent)
        .afterClosed()
        .pipe(
          switchMap((islogged: boolean) => {
            if (islogged) {
              console.log('loged in => pass throuht');
              return of(true);
            } else {
              console.log('NOT loged in => DENIED !');
              return of(false);
            }
          })
        );
    } else {
      return true;
    }

    /**
     * below code doesnt work = guard issue ???
     * const opens dialog even loginService returns true
     * needed to remove observable of boolean as loginService result
     * simple boolean instead..
     *
     */

    // const openDialog = this.matDialog.open(LoginComponent);

    // return this.loginService.isLoggedIn$.pipe(
    //   switchMap((isLoggedIn: Boolean) => {
    //     if (isLoggedIn === false) {
    //       return openDialog.afterClosed().pipe(
    //         switchMap((islogged: boolean) => {
    //           if (islogged) {
    //             console.log('loged in => pass throuht');
    //             return of(true);
    //           } else {
    //             console.log('NOT loged in => DENIED !');
    //             return of(false);
    //           }
    //         })
    //       );
    //     } else {
    //       return of(true);
    //     }
    //   })
    // );
  }
}
