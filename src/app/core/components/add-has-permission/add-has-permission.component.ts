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

import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreSandboxService } from '../../services/core-sandbox.service';
import { RestrictedUser } from '../../models/user.model';
import { RestrictedGroup } from '../../models/group.model';
import { RestrictedRlc } from '../../models/rlc.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { alphabeticalSorterByField } from '../../../shared/other/sorter-helper';

@Component({
    selector: 'app-add-has-permission',
    templateUrl: './add-has-permission.component.html',
    styleUrls: ['./add-has-permission.component.scss']
})
export class AddHasPermissionComponent implements OnInit {
    permissionId: string;

    allUsers: Observable<RestrictedUser[]>;
    selectedHasUser: RestrictedUser = null;

    allGroups: Observable<RestrictedGroup[]>;
    selectedHasGroup: RestrictedGroup = null;

    ownRlc: RestrictedRlc;
    hasRlcChecked = false;

    constructor(
        private coreSB: CoreSandboxService,
        public dialogRef: MatDialogRef<AddHasPermissionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
        this.allUsers = this.coreSB.getOtherUsers().pipe(
            tap(results => {
                alphabeticalSorterByField(results, 'name');
            })
        );
        this.allGroups = this.coreSB.getGroups().pipe(
            tap(results => {
                alphabeticalSorterByField(results, 'name');
            })
        );

        this.coreSB.getRlc().subscribe((rlc: RestrictedRlc) => {
            this.ownRlc = rlc;
        });

        if (this.data && this.data.permissionId) {
            this.permissionId = this.data.permissionId;
        } else {
            this.coreSB.showErrorSnackBar('error: no permission id');
        }
    }

    onAddClick(): void {
        this.coreSB.startCreatingHasPermission(
            this.permissionId,
            this.selectedHasUser,
            this.selectedHasGroup,
            this.hasRlcChecked ? this.ownRlc : null,
            null,
            null,
            this.ownRlc
        );
        this.dialogRef.close();
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    userHasChanged(selectedUser: RestrictedUser): void {
        this.selectedHasUser = selectedUser;
        if (selectedUser) {
            this.selectedHasGroup = null;
            this.hasRlcChecked = false;
        }
    }

    groupHasChanged(selectedGroup: RestrictedGroup): void {
        this.selectedHasGroup = selectedGroup;
        if (selectedGroup) {
            this.selectedHasUser = null;
            this.hasRlcChecked = false;
        }
    }

    hasRlcChanged(): void {
        this.selectedHasUser = null;
        this.selectedHasGroup = null;
    }
}
