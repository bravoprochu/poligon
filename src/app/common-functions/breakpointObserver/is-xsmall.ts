import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

export const IS_XSMALL = (
  breakpointObserver: BreakpointObserver
): Observable<boolean> =>
  breakpointObserver.observe(Breakpoints.XSmall).pipe(
    map((result) => result.matches),
    shareReplay()
  );
