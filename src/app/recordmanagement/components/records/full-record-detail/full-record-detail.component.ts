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

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FullRecord } from '../../../models/record.model';
import { RecordsSandboxService } from '../../../services/records-sandbox.service';
import { FullClient } from '../../../models/client.model';
import { OriginCountry } from '../../../models/country.model';
import { FormControl, FormGroup } from '@angular/forms';
import { RecordDocument } from '../../../models/record_document.model';
import { RecordMessage } from '../../../models/record_message.model';
import { Tag } from '../../../models/tag.model';
import { State } from '../../../../core/models/state.model';
import { CoreSandboxService } from '../../../../core/services/core-sandbox.service';
import { dateInPastValidator } from '../../../../statics/validators.statics';
import { alphabeticalSorterByField } from '../../../../shared/other/sorter-helper';
import { tap } from 'rxjs/internal/operators/tap';
import { SharedSandboxService } from '../../../../shared/services/shared-sandbox.service';
import { RlcSettings } from '../../../../core/models/rlc_settings.model';
import { HasUnsaved } from '../../../../core/services/can-have-unsaved.interface';
import { RestrictedUser } from '../../../../core/models/user.model';

const hash = require('object-hash');

@Component({
    selector: 'app-full-record-detail',
    templateUrl: './full-record-detail.component.html',
    styleUrls: ['./full-record-detail.component.scss']
})
export class FullRecordDetailComponent implements OnInit, OnDestroy, HasUnsaved {
    allCountries: Observable<OriginCountry[]>;
    originCountryError: any;
    givenOriginCountry: OriginCountry;

    allRecordTags: Observable<Tag[]>;
    recordTagErrors: any;

    allRecordStates: Observable<State[]>;
    givenRecordState: State;

    record: FullRecord;
    client: FullClient;
    origin_country: OriginCountry;
    record_documents: RecordDocument[];
    record_messages: RecordMessage[];

    recordEditForm: RecordFormGroup;
    user_working_on_record = false;
    rlc_options = {
        show_yielding: false
    };

    startHash: string;

    settingsSubscription: Subscription;
    specialRecordSubscription: Subscription;

    constructor(
        private recordSB: RecordsSandboxService,
        private coreSB: CoreSandboxService,
        private sharedSB: SharedSandboxService
    ) {
        this.recordEditForm = new RecordFormGroup(recordSB, coreSB);
    }

    @HostListener('window:beforeunload', ['$event'])
    onWindowClose(event: any): void {
        // Do something
        if (this.startHash !== this.recordEditForm.getHash()) {
            alert('unsaved content');

            event.preventDefault();
            event.returnValue = false;
        }
    }

    ngOnDestroy() {
        this.recordSB.resetFullClientInformation();
        this.settingsSubscription.unsubscribe();
        this.specialRecordSubscription.unsubscribe();
    }

    ngOnInit() {
        this.allCountries = this.recordSB.getOriginCountries();
        this.allRecordTags = this.recordSB.getRecordTags().pipe(
            tap(results => {
                alphabeticalSorterByField(results, 'name');
            })
        );
        this.allRecordStates = this.recordSB.getRecordStates();

        // there but not changeable
        // first_contact_date, last_edited, token
        this.specialRecordSubscription = this.recordSB
            .getSpecialRecord()
            .subscribe(
                (special_record: {
                    record: FullRecord;
                    client: FullClient;
                    origin_country: OriginCountry;
                    record_documents: RecordDocument[];
                    record_messages: RecordMessage[];
                }) => {
                    this.record = special_record.record;
                    this.client = special_record.client;

                    this.origin_country = special_record.origin_country;
                    this.record_documents = Object.values(special_record.record_documents);
                    this.record_messages = Object.values(special_record.record_messages);

                    if (this.client && this.record) this.loadValues();
                }
            );

        this.settingsSubscription = this.coreSB
            .getRlcSettings()
            .subscribe((settings: RlcSettings) => {
                if (settings && settings.recordPoolEnabled) {
                    this.rlc_options.show_yielding = true;
                }
            });
    }

    loadValues() {
        this.recordEditForm.loadValuesFromRecordAndClient(this.record, this.client);
        this.startHash = this.recordEditForm.getHash();
    }

    hasUnsaved(): boolean {
        return this.startHash !== this.recordEditForm.getHash();
    }

    onSaveClick() {
        const changes = this.recordEditForm.getChanges();
        if (Object.keys(changes).length === 0) {
        } else {
            this.recordSB.startSavingRecord(changes, this.record.id);
            this.startHash = this.recordEditForm.getHash();
        }
    }

    onBackClick() {
        this.recordSB.goBack();
    }

    onSelectedOriginCountryChanged(newOriginCountry: OriginCountry): void {
        this.recordEditForm.originCountry = newOriginCountry;
    }

    onSelectedRecordTagsChanged(newTags: Tag[]): void {
        this.recordEditForm.record_tags = newTags;
        if (newTags.length === 0) {
            this.recordTagErrors = { null: 'true' };
        } else {
            this.recordTagErrors = null;
        }
    }

    onSelectedRecordStateChanged(event: State): void {
        this.recordEditForm.recordState = event;
    }

    adjustTextAreaHeight(o) {
        o.style.height = '1px';
        o.style.height = 25 + o.scrollHeight + 'px';
    }

    downloadAllRecordDocuments(event) {
        event.stopPropagation();
        this.recordSB.downloadAllRecordDocuments();
    }

    onChangeRecordTokenClick() {
        this.sharedSB.openEditTextDialog(
            {
                short: true,
                descriptionLabel: 'record token',
                text: this.record.token,
                descriptionText: 'please enter new record token'
            },
            (newToken: string) => {
                if (newToken) {
                    this.record.token = newToken;
                    this.record.last_contact_date = CoreSandboxService.transformDate(
                        this.recordEditForm.value['last_contact_date']
                    );
                    this.client.birthday = CoreSandboxService.transformDate(
                        this.recordEditForm.value['client_birthday']
                    );
                }
            }
        );
    }

    onRequestRecordDeletionClick() {
        this.sharedSB.openEditTextDialog(
            {
                short: false,
                descriptionLabel: 'record deletion',
                text: '',
                descriptionText: 'please explain why you want to delete this record',
                saveLabel: 'delete',
                saveColor: 'warn'
            },
            (deletion_description: string) => {
                if (deletion_description) {
                    this.sharedSB.openConfirmDialog(
                        {
                            description: 'are you sure you want to delete the record?',
                            confirmLabel: 'delete',
                            confirmColor: 'warn'
                        },
                        (delete_record: boolean) => {
                            if (delete_record) {
                                this.recordSB.startRequestingRecordDeletion(
                                    this.record,
                                    deletion_description
                                );
                            }
                        }
                    );
                }
            }
        );
    }

    onYieldingRecordClick() {
        this.sharedSB.openConfirmDialog(
            {
                confirmLabel: 'sure',
                cancelLabel: 'cancel',
                description: 'are you sure you want to yield from record?',
                title: 'Yield Record',
                confirmColor: 'warn'
            },
            result => {
                if (result) {
                    // yield record
                    this.recordSB.startYieldingRecord(this.record);
                }
            }
        );
    }
}

class RecordFormGroup extends FormGroup {
    public originCountry: OriginCountry;
    public recordState: State;
    public working_on_record: RestrictedUser[];
    public current_user_working_on_record: boolean;
    public record_tags: Tag[];

    fields = [
        'client_name',
        'client_birthday',
        'client_phone',
        'client_note',
        'official_note',
        'state',
        'note',
        'contact',
        'bamf_token',
        'foreign_token',
        'first_correspondence',
        'circumstances',
        'lawyer',
        'next_steps',
        'status_described',
        'additional_facts',
        'related_persons',
        'consultant_team',
        'last_contact_date'
    ];
    org_hashes: any;

    constructor(private recordSB: RecordsSandboxService, private coreSB: CoreSandboxService) {
        super({
            client_name: new FormControl(''),
            client_birthday: new FormControl('', [dateInPastValidator]),
            client_phone: new FormControl(''),
            client_note: new FormControl(''),
            note: new FormControl(''),
            official_note: new FormControl(''),
            last_contact_date: new FormControl('', [dateInPastValidator]),
            state: new FormControl(''),
            consultant_team: new FormControl(''),
            lawyer: new FormControl(''),
            related_persons: new FormControl(''),
            contact: new FormControl(''),
            bamf_token: new FormControl(''),
            foreign_token: new FormControl(''),
            first_correspondence: new FormControl(''),
            circumstances: new FormControl(''),
            next_steps: new FormControl(''),
            status_described: new FormControl(''),
            additional_facts: new FormControl('')
        });
        this.org_hashes = { field_hashes: {}, origin_country: '', record_state: '' };
    }

    loadValuesFromRecordAndClient(record: FullRecord, client: FullClient): void {
        const clientObject = { ...client };
        const recordObject = { ...record };

        const field_hashes = {};
        for (const label of this.fields) {
            if (label.startsWith('client_')) {
                this.controls[label].setValue(clientObject[label.substring(7)]);
            } else {
                this.controls[label].setValue(recordObject[label]);
            }
            field_hashes[label] = hash(this.value[label]);
            this.org_hashes['field_hashes'][label] = hash(this.value[label]);
        }

        this.originCountry = this.recordSB.getOriginCountryById(client.origin_country);
        this.org_hashes['origin_country'] = hash(this.originCountry);

        this.recordState = this.recordSB.getRecordStateByAbbreviation(record.state);
        this.org_hashes['record_state'] = hash(this.recordState);

        this.record_tags = record.tags;
        this.org_hashes['record_tags'] = hash(this.record_tags);

        this.coreSB.getUser().subscribe(user => {
            record.working_on_record.forEach(currentUser => {
                if (currentUser['id'] === user.id) this.current_user_working_on_record = true;
            });
        });
    }

    getChanges(): any {
        const changes = { record: {}, client: {} };
        for (const label of this.fields) {
            if (label.startsWith('client_')) {
                if (hash(this.value[label]) !== this.org_hashes['field_hashes'][label]) {
                    changes['client'][label.substring(7)] = this.value[label];
                }
            } else {
                if (hash(this.value[label]) !== this.org_hashes['field_hashes'][label]) {
                    changes['record'][label] = this.value[label];
                }
            }
        }
        if (hash(this.recordState) !== this.org_hashes['record_state']) {
            changes['record']['state'] = this.recordState;
        }
        if (hash(this.originCountry) !== this.org_hashes['origin_country']) {
            changes['client']['origin_country'] = this.originCountry.id;
        }
        if (hash(this.record_tags) !== this.org_hashes['record_tags']) {
            changes['record']['tagged'] = this.originCountry.id;
        }

        return changes;
    }

    getHash(): string {
        const objects = {
            edit: this.getRawValue(),
            origin: this.originCountry,
            state: this.recordState
        };
        return hash(objects);
    }
}
