import {Injectable} from '@angular/core';
import {UrlTree, CanLoad, Route, UrlSegment, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {

    constructor(private authService: AuthService,
                private router: Router) {

    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.authService.userIsAuthenticated) {
            this.router.navigate(['/auth']);
        } else {
            return this.authService.userIsAuthenticated;
        }

    }
}
