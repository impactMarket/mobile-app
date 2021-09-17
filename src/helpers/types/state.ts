import { ContractKit } from '@celo/contractkit';
import { Subscription } from '@unimodules/core';

import {
    ApiErrorReturn,
    ICommunitiesListStories,
    ICommunityStory,
    IUserAuth,
} from './endpoints';
import { CommunityAttributes, UserAttributes } from './models';

export interface IUserWallet {
    address: string;
    phoneNumber: string;
    balance: string;
}

// state

export interface IUserState {
    wallet: IUserWallet;
    metadata: UserAttributes;
    exchangeRate: number; // it's singular!
    community: {
        isBeneficiary: boolean;
        isManager: boolean;
        metadata: CommunityAttributes;
        contract: any;
    };
}

export interface IAuthState {
    pushNotificationToken: string;
    authToken: string;
    user: IUserAuth | undefined;
    refreshing: boolean;
    error: ApiErrorReturn | undefined;
}
export interface IModalDonateState {
    donationValues: {
        inputAmount: string;
        amountInDollars: number;
        backNBeneficiaries: number;
        backForDays: number;
    };
    community?: CommunityAttributes;
    inProgress: boolean;
    modalDonateOpen: boolean;
    modalConfirmOpen: boolean;
    modalErrorOpen: boolean;
    submitting: boolean;
}
export interface IStoriesState {
    stories: ICommunitiesListStories[];
    myStories: ICommunityStory[];
    refreshing: boolean;
}

export interface IAppState {
    kit: ContractKit;
    exchangeRates: { [key: string]: number };
    suspectWrongDateTime: boolean;
    authModalOpen: boolean;
    hasBeneficiaryAcceptedRulesAlready: boolean;
    hasManagerAcceptedRulesAlready: boolean;
    timeDiff: number;
    fromWelcomeScreen: string;
    notificationsListeners?: {
        notificationReceivedListener: Subscription;
        notificationResponseReceivedListener: Subscription;
    };
}

export interface IOfflineState {
    queue: [];
    isConnected: true;
}

export interface ICommunitiesState {
    communities: CommunityAttributes[];
    count: number;
    community: CommunityAttributes;
    refreshing: boolean;
    reachedEndList: boolean;
}
export interface IRootState {
    offline?: IOfflineState;
    user: IUserState;
    auth: IAuthState;
    app: IAppState;
    modalDonate: IModalDonateState;
    stories: IStoriesState;
    communities: ICommunitiesState;
}

export interface ICallerRouteParams {
    caller: string;
}
