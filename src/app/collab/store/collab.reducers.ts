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

import { NameCollabDocument } from '../models/collab-document.model';
import { CollabActions, SET_ALL_DOCUMENTS } from './collab.actions';
import { getIdObjects } from '../../shared/other/reducer-helper';
import { tree } from 'lib0';

export interface CollabState {
    all_documents: NameCollabDocument[];
    all_documents_tree: NameCollabDocument[];
}

export const initialState: CollabState = {
    all_documents: [],
    all_documents_tree: []
};

export function collabReducer(state = initialState, action: CollabActions) {
    switch (action.type) {
        case SET_ALL_DOCUMENTS:
            const all_docs = getAllDocsFromTree(action.payload);

            return {
                ...state,
                all_documents_tree: getIdObjects(action.payload),
                all_documents: getIdObjects(all_docs)
            };
        default:
            return state;
    }
}

const getAllDocsFromTree = (tree_docs: NameCollabDocument[]): NameCollabDocument[] => {
    const all_docs: NameCollabDocument[] = [];
    for (const doc of tree_docs) {
        all_docs.push(doc);
        all_docs.push(...getAllDocsFromTree(doc.children));
    }
    return all_docs;
};
