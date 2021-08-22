import {
    SET_AUTH_TOKEN,
    SET_PUSH_NOTIFICATION_TOKEN,
    SET_USER_AUTH_REQUEST,
    SET_USER_AUTH_SUCCESS,
    SET_USER_AUTH_FAILURE,
} from 'helpers/constants';
import { AuthActionTypes } from 'helpers/types/redux';
import { IAuthState } from 'helpers/types/state';

const INITIAL_STATE_AUTH: IAuthState = {
    pushNotificationToken: '',
    authToken: '',
    user: undefined,
    refreshing: false,
    error: undefined,
};

export const authReducer = (
    state = INITIAL_STATE_AUTH,
    action: AuthActionTypes
) => {
    switch (action.type) {
        case SET_PUSH_NOTIFICATION_TOKEN:
            return { ...state, pushNotificationToken: action.payload };
        case SET_AUTH_TOKEN:
            return { ...state, authToken: action.payload };
        case SET_USER_AUTH_SUCCESS:
            return { ...state, user: action.payload, refreshing: false };
        case SET_USER_AUTH_REQUEST:
            return { ...state, refreshing: true };
        case SET_USER_AUTH_FAILURE:
            return { ...state, error: action.payload, refreshing: false };
        default:
            return state;
    }
};
