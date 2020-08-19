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
import { RestrictedRecord } from '../../../models/record.model';
import { RecordsSandboxService } from '../../../services/records-sandbox.service';
import { Router } from '@angular/router';
import { GetRecordSearchFrontUrl } from '../../../../statics/frontend_links.statics';
import { Tag } from '../../../models/tag.model';

@Component({
    selector: 'app-restricted-record-detail',
    templateUrl: './restricted-record-detail.component.html',
    styleUrls: ['./restricted-record-detail.component.scss']
})
export class RestrictedRecordDetailComponent implements OnInit {
    record: RestrictedRecord;
    request_state = 'nr';

    constructor(private recordSB: RecordsSandboxService, private router: Router) {}

    ngOnInit() {
        this.recordSB
            .getSpecialRecord()
            .subscribe((special_record: { record: RestrictedRecord }) => {
                if (special_record.record) this.record = special_record.record;
            });
        this.recordSB.getSpecialRecordRequestState().subscribe((state: string) => {
            if (state) this.request_state = state;
        });
    }

    onTagClick(tag: Tag) {
        this.router.navigateByUrl(GetRecordSearchFrontUrl(tag.name));
    }

    onRequestReadPermission() {
        this.recordSB.startRequestReadPermission(this.record);
    }
}
