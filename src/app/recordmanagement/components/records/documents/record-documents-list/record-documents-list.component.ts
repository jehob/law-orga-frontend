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
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { RecordsSandboxService } from '../../../../services/records-sandbox.service';
import { RecordDocument } from '../../../../models/record_document.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedSandboxService } from '../../../../../shared/services/shared-sandbox.service';

@Component({
    selector: 'app-record-documents-list',
    templateUrl: './record-documents-list.component.html',
    styleUrls: ['./record-documents-list.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
        ])
    ]
})
export class RecordDocumentsListComponent implements OnInit {
    @Input()
    documents: RecordDocument[];

    columns = ['name', 'tags', 'date', 'actions'];
    expandedElement: RecordDocument | null;

    @ViewChild('fileInput', { static: true })
    fileInput: ElementRef<HTMLInputElement>;

    constructor(private recordSB: RecordsSandboxService, private sharedSB: SharedSandboxService) {}

    ngOnInit() {}

    dropped($event) {
        event.preventDefault();
        const files = $event.dataTransfer.files;
        this.recordSB.uploadRecordDocuments(files);
    }

    selected($event) {
        event.preventDefault();
        const files = Array.from(this.fileInput.nativeElement.files);
        this.recordSB.uploadRecordDocuments(files);
    }

    onDocumentDownloadClick(document: RecordDocument, $event): void {
        $event.stopPropagation();
        this.recordSB.downloadRecordDocument(document);
    }

    onDocumentDeleteClick(document: RecordDocument, $event): void {
        $event.stopPropagation();

        this.sharedSB.openEditTextDialog(
            {
                short: false,
                descriptionLabel: 'record document deletion',
                text: '',
                descriptionText: 'please explain why you want to delete this document',
                saveLabel: 'delete',
                saveColor: 'warn'
            },
            (deletion_description: string) => {
                if (deletion_description) {
                    this.sharedSB.openConfirmDialog(
                        {
                            description: 'are you sure you want to delete this document?',
                            confirmLabel: 'delete',
                            confirmColor: 'warn'
                        },
                        (delete_record: boolean) => {
                            if (delete_record) {
                                this.recordSB.startRequestingRecordDocumentDeletion(
                                    document,
                                    deletion_description
                                );
                            }
                        }
                    );
                }
            }
        );
    }

    dragover($event) {
        $event.preventDefault();
    }
}
