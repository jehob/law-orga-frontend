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
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { AuthEffects } from './core/store/auth/effects';
import { CoreSandboxService } from './core/services/core-sandbox.service';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './core/services/auth.interceptor';
import { environment } from '../environments/environment';
import { AppSandboxService } from './core/services/app-sandbox.service';
import { StatisticsSandboxService } from './core/services/statistics-sandbox.service';
import { SnackbarService } from './shared/services/snackbar.service';
import { SharedSandboxService } from './shared/services/shared-sandbox.service';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { CollabSandboxService } from './collab/services/collab-sandbox.service';
import { MaterialModule } from './material/material.module';
import { reducer as authReducer } from './core/store/auth/reducers';

Quill.register('modules/cursors', QuillCursors);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 24,
      logOnly: environment.production,
    }),
    QuillModule.forRoot({
      modules: {
        cursors: true,
        table: true,
        tableUI: true,
      },
    }),
  ],
  providers: [
    AuthGuardService,
    AppSandboxService,
    CoreSandboxService,
    CollabSandboxService,
    StatisticsSandboxService,
    SnackbarService,
    SharedSandboxService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
