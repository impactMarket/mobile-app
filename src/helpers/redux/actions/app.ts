import { ContractKit } from '@celo/contractkit';
import { Subscription } from '@unimodules/core';
import {
    appAction,
    SET_APP_FROM_WELCOME_SCREEN,
    SET_APP_SUSPECT_WRONG_DATETIME,
    SET_CELO_KIT,
    SET_EXCHANGE_RATES,
} from 'helpers/constants';
import { AppActionTypes } from 'helpers/types/redux';

export function setCeloKit(kit: ContractKit): AppActionTypes {
    return {
        type: SET_CELO_KIT,
        payload: kit,
    };
}

export function setAppSuspectWrongDateTime(
    suspect: boolean,
    timeDiff: number
): AppActionTypes {
    return {
        type: SET_APP_SUSPECT_WRONG_DATETIME,
        payload: {
            suspect,
            timeDiff,
        },
    };
}

export function SetAppFromWelcomeScreen(nextScreen: string): AppActionTypes {
    return {
        type: SET_APP_FROM_WELCOME_SCREEN,
        payload: nextScreen,
    };
}

export function setOpenAuthModal(open: boolean): AppActionTypes {
    return {
        type: appAction.SET_OPEN_AUTH_MODAL,
        payload: open,
    };
}

export function setOpenFaqModal(open: boolean): AppActionTypes {
    return {
        type: appAction.SET_OPEN_FAQ_MODAL,
        payload: open,
    };
}

export function setAppExchangeRatesAction(exchangeRates: {
    [key: string]: number;
}): AppActionTypes {
    return {
        type: SET_EXCHANGE_RATES,
        payload: exchangeRates,
    };
}

export function setPushNotificationListeners(notificationsListeners: {
    notificationReceivedListener: Subscription;
    notificationResponseReceivedListener: Subscription;
}): AppActionTypes {
    return {
        type: appAction.SET_PUSH_NOTIFICATION_LISTENERS,
        payload: notificationsListeners,
    };
}
