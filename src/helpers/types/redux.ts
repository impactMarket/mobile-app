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
    RESET_NETWORK_APP,
    SET_PUSH_NOTIFICATION_TOKEN,
    SET_AUTH_TOKEN,
    SET_USER_LANGUAGE,
    SET_APP_SUSPECT_WRONG_DATETIME,
    SET_APP_FROM_WELCOME_SCREEN,
    SET_EXCHANGE_RATES,
    SET_VIEW_MANAGER_DETAILS,
} from 'helpers/constants';
import { ICommunity, IManagersDetails } from './endpoints';
import { UserAttributes } from './models';
import { IUserWallet } from './state';

// export interface IInitUser {
//     wallet: IUserWallet;
//     metadata: IUser;
//     exchangeRates: any;
//     isBeneficiary: boolean;
//     isManager: boolean;
//     community?: ICommunity;
// }

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

// interface InitUserAction {
//     type: typeof INIT_USER;
//     payload: IInitUser;
// }

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

interface SetViewManagerDetailsAction {
    type: typeof SET_VIEW_MANAGER_DETAILS;
    payload: IManagersDetails;
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
    | SetAppFromWelcomeScreen;

export type ViewActionTypes = SetViewManagerDetailsAction;

export type IStoreCombinedActionsTypes =
    | UserActionTypes
    | AuthActionTypes
    | AppActionTypes
    | ViewActionTypes;
