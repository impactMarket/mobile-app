import { SET_AUTH_TOKEN, SET_PUSH_NOTIFICATION_TOKEN } from 'helpers/constants';
import { AuthActionTypes } from 'helpers/types/redux';
import { IAuthState } from 'helpers/types/state';

const INITIAL_STATE_AUTH: IAuthState = {
    pushNotificationToken: '',
    authToken: '',
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
        default:
            return state;
    }
};
