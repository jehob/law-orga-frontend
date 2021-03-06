import { Action } from '@ngrx/store';
import { FullUser } from '../models/user.model';
import { HasPermission, Permission } from '../models/permission.model';
import { RestrictedRlc } from '../models/rlc.model';
import { RestrictedGroup } from '../models/group.model';

export const ADD_NOTIFICATIONS = 'ADD_NOTIFICATIONS';
export const ADD_SINGLE_HAS_PERMISSION = 'ADD_SINGLE_HAS_PERMISSION';
export const REMOVE_SINGLE_HAS_PERMISSION = 'REMOVE_SINGLE_HAS_PERMISSION';
export const SET_ALL_PERMISSIONS = 'SET_ALL_PERMISSIONS';
export const SET_GROUPS = 'SET_GROUPS';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const SET_RLC = 'SET_RLC';
export const SET_RLCS = 'SET_RLCS';
export const SET_USER = 'SET_USER';
export const SET_USER_PERMISSIONS = 'SET_USER_PERMISSIONS';
export const START_CHECKING_USER_ACTIVATION_LINK = 'START_CHECKING_USER_ACTIVATION_LINK';
export const START_CHECKING_USER_HAS_PERMISSIONS = 'START_CHECKING_USER_HAS_PERMISSIONS';
export const START_CREATE_USER = 'START_CREATE_USER';
export const START_LOADING_GROUPS = 'START_LOADING_GROUPS';
export const START_LOADING_HAS_PERMISSION_STATICS = 'START_LOADING_HAS_PERMISSION_STATICS';
export const START_LOADING_RLCS = 'START_LOADING_RLCS';
export const START_PATCH_USER = 'START_PATCH_USER';
export const START_SAVING_USER = 'START_SAVING_USER';
export const START_LOADING_UNREAD_NOTIFICATIONS = 'START_LOADING_UNREAD_NOTIFICATIONS';
export const DECREMENT_NOTIFICATION_COUNTER = 'DECREMENT_NOTIFICATION_COUNTER';
export const INCREMENT_NOTIFICATION_COUNTER = 'INCREMENT_NOTIFICATION_COUNTER';

export class AddSingleHasPermission implements Action {
  readonly type = ADD_SINGLE_HAS_PERMISSION;

  constructor(public payload: HasPermission) {}
}

export class RemoveSingleHasPermission implements Action {
  readonly type = REMOVE_SINGLE_HAS_PERMISSION;

  constructor(public payload: string) {}
}

export class SetAllPermissions implements Action {
  readonly type = SET_ALL_PERMISSIONS;

  constructor(public payload: Permission[]) {}
}

export class SetGroups implements Action {
  readonly type = SET_GROUPS;

  constructor(public payload: RestrictedGroup[]) {}
}

export class SetRlc implements Action {
  readonly type = SET_RLC;

  constructor(public payload: RestrictedRlc) {}
}

export class SetRlcs implements Action {
  readonly type = SET_RLCS;

  constructor(public payload: RestrictedRlc[]) {}
}

export class SetUser implements Action {
  readonly type = SET_USER;

  constructor(public payload: FullUser) {}
}

export class SetUserPermissions implements Action {
  readonly type = SET_USER_PERMISSIONS;

  constructor(public payload: HasPermission[]) {}
}

export class StartCreateUser implements Action {
  readonly type = START_CREATE_USER;

  constructor(public payload: any) {}
}

export class StartLoadingGroups implements Action {
  readonly type = START_LOADING_GROUPS;
}

export class StartLoadingHasPermissionStatics implements Action {
  readonly type = START_LOADING_HAS_PERMISSION_STATICS;
}

export class StartLoadingRlcs implements Action {
  readonly type = START_LOADING_RLCS;
}

export class StartPatchUser implements Action {
  readonly type = START_PATCH_USER;

  constructor(public payload: { id: string; userUpdates: any }) {}
}

export class StartSavingUser implements Action {
  readonly type = START_SAVING_USER;

  constructor(public payload: FullUser) {}
}

export class StartCheckingUserHasPermissions implements Action {
  readonly type = START_CHECKING_USER_HAS_PERMISSIONS;
}

export class SetNotifications implements Action {
  readonly type = SET_NOTIFICATIONS;

  constructor(public payload: number) {}
}

export class IncrementNotificationCounter implements Action {
  readonly type = INCREMENT_NOTIFICATION_COUNTER;
}

export class DecrementNotificationCounter implements Action {
  readonly type = DECREMENT_NOTIFICATION_COUNTER;
}

export class StartLoadingUnreadNotifications implements Action {
  readonly type = START_LOADING_UNREAD_NOTIFICATIONS;
}

export type CoreActions =
  | AddSingleHasPermission
  | RemoveSingleHasPermission
  | SetAllPermissions
  | SetGroups
  | SetRlc
  | SetRlcs
  | SetUser
  | SetUserPermissions
  | StartCreateUser
  | StartLoadingGroups
  | StartLoadingHasPermissionStatics
  | StartLoadingRlcs
  | StartPatchUser
  | StartSavingUser
  | StartCheckingUserHasPermissions
  | SetNotifications
  | IncrementNotificationCounter
  | DecrementNotificationCounter
  | StartLoadingUnreadNotifications;
