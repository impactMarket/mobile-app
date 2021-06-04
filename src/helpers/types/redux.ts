import { ContractKit } from '@celo/contractkit';
import { Subscription } from '@unimodules/core';
import {
    SET_USER_CELO_INFO,
    SET_USER_INFO,
    SET_USER_EXCHANGE_RATE,
    // INIT_USER,
    SET_USER_WALLET_BALANCE,
    SET_USER_IS_BENEFICIARY,
    SET_USER_IS_BLOCKED,
    SET_USER_IS_SUSPECT,
    SET_USER_IS_COMMUNITY_MANAGER,
    SET_CELO_KIT,
    SET_APP_BENEFICIARY_HAS_ACCEPTED_TERMS,
    SET_APP_MANAGER_HAS_ACCEPTED_TERMS,
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
    storiesAction,
} from 'helpers/constants';

import { ICommunitiesListStories, ICommunityStory } from './endpoints';
import { CommunityAttributes, UserAttributes } from './models';
import { IUserWallet } from './state';

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

interface UserSetIsBlockedAction {
    type: typeof SET_USER_IS_BLOCKED;
    payload: boolean;
}

interface UserSetIsSuspectAction {
    type: typeof SET_USER_IS_SUSPECT;
    payload: boolean;
}

interface UserSetIsCommunityManagerAction {
    type: typeof SET_USER_IS_COMMUNITY_MANAGER;
    payload: boolean;
}

interface UserSetBeneficiaryAcceptedRulesAction {
    type: typeof SET_APP_BENEFICIARY_HAS_ACCEPTED_TERMS;
    payload: boolean;
}

interface UserSetManagerAcceptedRulesAction {
    type: typeof SET_APP_MANAGER_HAS_ACCEPTED_TERMS;
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
    payload: CommunityAttributes;
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
    payload: CommunityAttributes;
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

interface InitLoadStoriesActionRequest {
    type: typeof storiesAction.INIT_REQUEST;
    payload: { start: number; end: number };
}

interface InitLoadStoriesActionSuccess {
    type: typeof storiesAction.INIT_SUCCESS;
    payload: ICommunitiesListStories[];
}

interface InitLoadStoriesActionFailure {
    type: typeof storiesAction.INIT_FAILURE;
}

interface LoadMyStoriesActionRequest {
    type: typeof storiesAction.USER_STORIES_REQUEST;
    payload: ICommunityStory[];
}

interface LoadMyStoriesActionSuccess {
    type: typeof storiesAction.USER_STORIES_SUCCESS;
    payload: ICommunityStory[];
}

interface LoadMyStoriesActionFailure {
    type: typeof storiesAction.USER_STORIES_FAILURE;
}

interface LoadMoreStoriesAction {
    type: typeof storiesAction.CONCAT;
    payload: ICommunitiesListStories[];
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
    | UserSetIsBlockedAction
    | UserSetIsSuspectAction
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
    | SetAppPushNotificationListeners
    | UserSetBeneficiaryAcceptedRulesAction
    | UserSetManagerAcceptedRulesAction;

export type ModalActionTypes =
    | OpenModalDonateAction
    | GoToConfirmModalDonateAction
    | GoToErrorModalDonateAction
    | GoBackToModalDonateAction
    | InProgressModalDonateAction
    | CloseModalDonateAction;

export type StoriesActionTypes =
    | InitLoadStoriesActionRequest
    | InitLoadStoriesActionSuccess
    | InitLoadStoriesActionFailure
    | LoadMoreStoriesAction
    | LoadMyStoriesActionRequest
    | LoadMyStoriesActionSuccess
    | LoadMyStoriesActionFailure;

export type IStoreCombinedActionsTypes =
    | UserActionTypes
    | AuthActionTypes
    | AppActionTypes
    | ModalActionTypes
    | StoriesActionTypes;
