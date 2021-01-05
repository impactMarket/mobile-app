import {
    appAction,
    SET_APP_FROM_WELCOME_SCREEN,
    SET_APP_SUSPECT_WRONG_DATETIME,
    SET_CELO_KIT,
    SET_EXCHANGE_RATES,
} from 'helpers/constants';
import { AppActionTypes } from 'helpers/types/redux';
import { IAppState } from 'helpers/types/state';

const INITIAL_STATE_APP: IAppState = {
    kit: undefined as any,
    exchangeRates: undefined as any, // save exhangeRates on load
    suspectWrongDateTime: false,
    timeDiff: 0,
    fromWelcomeScreen: '',
};

export const appReducer = (
    state = INITIAL_STATE_APP,
    action: AppActionTypes
) => {
    switch (action.type) {
        case SET_CELO_KIT:
            return { ...state, kit: action.payload };
        case SET_EXCHANGE_RATES:
            return { ...state, exchangeRates: action.payload };
        case SET_APP_SUSPECT_WRONG_DATETIME:
            return {
                ...state,
                suspectWrongDateTime: action.payload.suspect,
                timeDiff: action.payload.timeDiff,
            };
        case SET_APP_FROM_WELCOME_SCREEN:
            return {
                ...state,
                fromWelcomeScreen: action.payload,
            };
        case appAction.SET_PUSH_NOTIFICATION_LISTENERS:
            return {
                ...state,
                notificationsListeners: action.payload,
            };
        default:
            return state;
    }
};
