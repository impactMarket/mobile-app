import {
    SET_USER_AUTH_REQUEST,
    SET_USER_AUTH_SUCCESS,
    SET_USER_AUTH_FAILURE,
    SET_PUSH_NOTIFICATION_TOKEN,
    SET_AUTH_TOKEN,
    SET_USER_AUTH_RESET,
} from 'helpers/constants';
import { IUserAuth } from 'helpers/types/endpoints';
import { AuthActionTypes } from 'helpers/types/redux';
import { markActionsOffline } from 'redux-offline-queue';
import { AuthParams } from 'services/api/routes/user';

markActionsOffline(SET_USER_AUTH_REQUEST, [addUserAuthToStateRequest]);

export function addUserAuthToStateRequest(
    authParams: AuthParams
): AuthActionTypes {
    return {
        type: SET_USER_AUTH_REQUEST,
        payload: authParams,
    };
}

export function addUserAuthToStateSuccess(user: IUserAuth): AuthActionTypes {
    return {
        type: SET_USER_AUTH_SUCCESS,
        payload: user,
    };
}

export function addUserAuthToStateFailure(err: string): AuthActionTypes {
    return {
        type: SET_USER_AUTH_FAILURE,
        payload: err,
    };
}

export function userAuthToStateReset(): AuthActionTypes {
    return {
        type: SET_USER_AUTH_RESET,
    };
}

export function setPushNotificationsToken(token: string): AuthActionTypes {
    return {
        type: SET_PUSH_NOTIFICATION_TOKEN,
        payload: token,
    };
}

export function setAuthToken(token: string): AuthActionTypes {
    return {
        type: SET_AUTH_TOKEN,
        payload: token,
    };
}
