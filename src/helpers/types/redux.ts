import { ContractKit } from '@celo/contractkit';
import {
    SET_USER_CELO_INFO,
    SET_USER_INFO,
    SET_USER_EXCHANGE_RATE,
    // INIT_USER,
    SET_USER_WALLET_BALANCE,
    SET_USER_IS_BENEFICIARY,
    SET_USER_IS_COMMUNITY_MANAGER,
    SET_CELO_KIT,
    SET_COMMUNITY_CONTRACT,
    SET_COMMUNITY,
    RESET_USER_APP,
    // RESET_NETWORK_APP,
    SET_PUSH_NOTIFICATION_TOKEN,
    SET_AUTH_TOKEN,
    SET_USER_LANGUAGE,
    SET_APP_SUSPECT_WRONG_DATETIME,
    SET_APP_FROM_WELCOME_SCREEN,
    SET_EXCHANGE_RATES,
    appAction,
    modalDonateAction,
} from 'helpers/constants';
import { ICommunity } from './endpoints';
import { UserAttributes } from './models';
import { IUserWallet } from './state';
import { Subscription } from '@unimodules/core';

// action
interface UserWalletAction {
    type: typeof SET_USER_CELO_INFO;
    payload: IUserWallet;
}

interface UserMetadataAction {
    type: typeof SET_USER_INFO;
    payload: UserAttributes;
}

interface UserExchangeRateAction {
    type: typeof SET_USER_EXCHANGE_RATE;
    payload: number;
}

interface UserSetBalanceAction {
    type: typeof SET_USER_WALLET_BALANCE;
    payload: string;
}

interface UserSetIsBeneficiaryAction {
    type: typeof SET_USER_IS_BENEFICIARY;
    payload: boolean;
}

interface UserSetIsCommunityManagerAction {
    type: typeof SET_USER_IS_COMMUNITY_MANAGER;
    payload: boolean;
}

interface CeloKitAction {
    type: typeof SET_CELO_KIT;
    payload: ContractKit;
}

interface SetCommunityContractAction {
    type: typeof SET_COMMUNITY_CONTRACT;
    payload: any;
}

interface SetCommunityMetadataAction {
    type: typeof SET_COMMUNITY;
    payload: ICommunity;
}

interface ResetUserAction {
    type: typeof RESET_USER_APP;
    payload: any;
}

interface SetTokenPushNotificationsAction {
    type: typeof SET_PUSH_NOTIFICATION_TOKEN;
    payload: string;
}

interface SetAuthTokenAction {
    type: typeof SET_AUTH_TOKEN;
    payload: string;
}
interface UserLanguageAction {
    type: typeof SET_USER_LANGUAGE;
    payload: string;
}

interface SetAppSuspectWrongDateTime {
    type: typeof SET_APP_SUSPECT_WRONG_DATETIME;
    payload: {
        suspect: boolean;
        timeDiff: number;
    };
}
interface SetAppFromWelcomeScreen {
    type: typeof SET_APP_FROM_WELCOME_SCREEN;
    payload: string;
}

interface SetAppEchangeRatesAction {
    type: typeof SET_EXCHANGE_RATES;
    payload: any;
}

interface OpenModalDonateAction {
    type: typeof modalDonateAction.OPEN;
    payload: ICommunity;
}

interface GoToConfirmModalDonateAction {
    type: typeof modalDonateAction.GO_TO_CONFIRM_DONATE;
    payload: {
        inputAmount: string;
        amountInDollars: number;
        backNBeneficiaries: number;
        backForDays: number;
    };
}

interface GoToErrorModalDonateAction {
    type: typeof modalDonateAction.GO_TO_ERROR_DONATE;
}

interface GoBackToModalDonateAction {
    type: typeof modalDonateAction.GO_BACK_TO_DONATE;
}

interface InProgressModalDonateAction {
    type: typeof modalDonateAction.IN_PROGRESS;
    payload: boolean;
}

interface CloseModalDonateAction {
    type: typeof modalDonateAction.CLOSE;
}

interface SetAppPushNotificationListeners {
    type: typeof appAction.SET_PUSH_NOTIFICATION_LISTENERS;
    payload: {
        notificationReceivedListener: Subscription;
        notificationResponseReceivedListener: Subscription;
    };
}

export type UserActionTypes =
    | UserWalletAction
    | UserSetBalanceAction
    | UserSetIsBeneficiaryAction
    | UserSetIsCommunityManagerAction
    | ResetUserAction
    | UserMetadataAction
    | UserLanguageAction
    | UserExchangeRateAction
    | SetCommunityContractAction
    | SetCommunityMetadataAction;

export type AuthActionTypes =
    | SetTokenPushNotificationsAction
    | SetAuthTokenAction;

export type AppActionTypes =
    | CeloKitAction
    | SetAppEchangeRatesAction
    | SetAppSuspectWrongDateTime
    | SetAppFromWelcomeScreen
    | SetAppPushNotificationListeners;

export type ModalActionTypes =
    | OpenModalDonateAction
    | GoToConfirmModalDonateAction
    | GoToErrorModalDonateAction
    | GoBackToModalDonateAction
    | InProgressModalDonateAction
    | CloseModalDonateAction;

export type IStoreCombinedActionsTypes =
    | UserActionTypes
    | AuthActionTypes
    | AppActionTypes;
