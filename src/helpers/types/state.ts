import { ContractKit } from '@celo/contractkit';
import { Subscription } from '@unimodules/core';

import { ICommunitiesListStories, ICommunityStory } from './endpoints';
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
}

export interface IAppState {
    kit: ContractKit;
    exchangeRates: { [key: string]: number };
    suspectWrongDateTime: boolean;
    hasBeneficiaryAcceptedRulesAlready: boolean;
    hasManagerAcceptedRulesAlready: boolean;
    timeDiff: number;
    fromWelcomeScreen: string;
    notificationsListeners?: {
        notificationReceivedListener: Subscription;
        notificationResponseReceivedListener: Subscription;
    };
}

export interface IRootState {
    user: IUserState;
    auth: IAuthState;
    app: IAppState;
    modalDonate: IModalDonateState;
    stories: IStoriesState;
}

export interface ICallerRouteParams {
    caller: string;
}
