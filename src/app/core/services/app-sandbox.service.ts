/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2019  Dominik Walser
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { Injectable } from '@angular/core';
import { AppState } from '../../store/app.reducers';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import {
    ForgotPassword,
    ReloadStaticInformation,
    ResetPassword,
    SetUsersPrivateKey,
    SetToken,
    StartLoggingOut,
    TryLogin
} from '../store/auth/auth.actions';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState } from '../store/auth/auth.reducers';
import { LOGIN_FRONT_URL } from '../../statics/frontend_links.statics';
import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';

@Injectable()
export class AppSandboxService {
    savedLocation = '';
    toggleNav: Function;
    navbar;

    static getPrivateKeyPlaceholder(): any {
        let headers = new HttpHeaders();
        headers = headers.append('private-key', 'placeholder');
        return { headers };
    }

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private cookieService: CookieService,
        private media: MediaMatcher
    ) {}

    isAuthenticated(): boolean {
        let isAuthenticated = false;
        this.store
            .pipe(
                take(1),
                select((state: any) => state.auth.authenticated)
            )
            .subscribe(authenticated => (isAuthenticated = authenticated));
        return isAuthenticated;
    }

    logout() {
        // this.resetTokenAndUsersPrivateKey();
        this.store.dispatch(new StartLoggingOut());
        // this.router.navigate([LOGIN_FRONT_URL]);
    }

    login(username: string, password: string) {
        this.store.dispatch(new TryLogin({ username, password }));
    }

    startApp(): Observable<AuthState> {
        const loginInformation = this.loadTokenAndUsersPrivateKey();
        if (loginInformation.token !== null && loginInformation.token !== '') {
            this.store.dispatch(new SetToken(loginInformation.token));
            this.store.dispatch(new SetUsersPrivateKey(loginInformation.users_private_key));
            this.store.dispatch(new ReloadStaticInformation());
        }
        return this.store.pipe(select('auth'));
    }

    saveLocation() {
        this.savedLocation = this.router.url;
    }

    forgotPassword(email: string): void {
        this.store.dispatch(new ForgotPassword({ email }));
    }

    resetPassword(new_password: string, link_id: string): void {
        this.store.dispatch(new ResetPassword({ new_password, link_id }));
    }

    saveTokenAndUsersPrivateKey(token: string, users_private_key: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('users_private_key', users_private_key);
        // if (
        //     window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1 &&
        //     !!(<any>window).chrome
        // ) {
        //     document.cookie = `token=${token}`;
        //     console.log('chrome want to set private key: ', users_private_key);
        //     document.cookie = `users_private_key=${users_private_key}`;
        //     console.log('cookies set "manually"');
        // } else {
        //     this.cookieService.set('token', token);
        //     this.cookieService.set('users_private_key', users_private_key);
        // }
    }

    loadTokenAndUsersPrivateKey(): any {
        // console.log('read private key: ', this.cookieService.get('users_private_key'));
        //
        // return {
        //     token: this.cookieService.get('token'),
        //     users_private_key: this.cookieService.get('users_private_key')
        // };

        return {
            token: localStorage.getItem('token'),
            users_private_key: localStorage.getItem('users_private_key')
        };
    }

    resetTokenAndUsersPrivateKey(): void {
        // this.cookieService.delete('token');
        // this.cookieService.delete('users_private_key');
        localStorage.clear();
    }

    setNavbar(navbar) {
        this.navbar = navbar;
    }

    closeNavbar(): void {
        if (this.navbar) this.navbar.close();
    }

    openNavbar(): void {
        if (this.navbar) this.navbar.open();
    }

    toggleNavbar(): void {
        if (this.navbar) this.navbar.toggle();
    }

    isOnMobile(): boolean {
        return this.media.matchMedia('(max-width: 600px)').matches;
    }
}
