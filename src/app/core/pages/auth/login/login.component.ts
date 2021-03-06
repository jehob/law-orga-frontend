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

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppSandboxService } from '../../../services/app-sandbox.service';
import { MAIN_PAGE_FRONT_URL } from '../../../../statics/frontend_links.statics';
import { CoreSandboxService } from '../../../services/core-sandbox.service';
import { Store } from '@ngrx/store';
import { TryLogin } from '../../../store/auth/actions';
import { Article } from 'src/app/core/models/article';
import { HttpClient } from '@angular/common/http';
import { RoadmapItem } from 'src/app/core/models/roadmapItem';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  fields = [
    {
      label: 'E-Mail',
      type: 'email',
      tag: 'input',
      name: 'email',
      required: true,
    },
    {
      label: 'Password',
      type: 'password',
      tag: 'input',
      name: 'password',
      required: true,
    },
  ];
  articles: Article[];
  page: {
    content: string;
  };
  roadmapItems: RoadmapItem[];

  activityItems = [{ id: 1, person: 'Lindsay Walton', project: 'Workcation', commit: '2d89f0c8', environment: 'production', time: '1h' }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appSB: AppSandboxService,
    private coreSB: CoreSandboxService,
    private store: Store,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (this.appSB.isAuthenticated()) {
      void this.router.navigate([MAIN_PAGE_FRONT_URL]);
    }

    // if an activation link was used try to activate the user
    // url: activate-user/:id/:token/
    this.route.params.subscribe((params: Params) => {
      const token: string = params['token'] as string;
      const userId: number = params['userid'] as number;
      if (token && userId) this.coreSB.startCheckingUserActivationLink(userId, token);
    });

    this.http.get('api/articles/').subscribe((response: Article[]) => (this.articles = response));
    this.http.get('api/pages/index/').subscribe((response: { content: string }) => (this.page = response));
    this.http.get('api/roadmap-items/').subscribe((response: RoadmapItem[]) => (this.roadmapItems = response));
  }

  onSend(data: { email: string; password: string }): void {
    this.store.dispatch(TryLogin({ username: data.email, password: data.password }));
  }
}
