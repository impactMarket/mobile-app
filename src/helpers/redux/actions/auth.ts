import { SET_PUSH_NOTIFICATION_TOKEN, SET_AUTH_TOKEN } from 'helpers/constants';
import { AuthActionTypes } from 'helpers/types/redux';

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
