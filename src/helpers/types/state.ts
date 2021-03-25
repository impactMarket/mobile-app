import { ContractKit } from '@celo/contractkit';
import { Subscription } from '@unimodules/core';

import { ICommunitiesListStories, ICommunity } from './endpoints';
import { UserAttributes } from './models';

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
        metadata: ICommunity;
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
    community?: ICommunity;
    inProgress: boolean;
    modalDonateOpen: boolean;
    modalConfirmOpen: boolean;
    modalErrorOpen: boolean;
    submitting: boolean;
}
export interface IStoriesState {
    stories: ICommunitiesListStories[];
}

export interface IAppState {
    kit: ContractKit;
    exchangeRates: { [key: string]: number };
    suspectWrongDateTime: boolean;
    hasAcceptedRulesAlready: boolean;
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
