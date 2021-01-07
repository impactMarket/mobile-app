import { ContractKit } from '@celo/contractkit';
import { ICommunity, IManagersDetails } from './endpoints';
import { UserAttributes } from './models';
import { Subscription } from '@unimodules/core';

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

export interface IViewState {
    managerDetails?: IManagersDetails;
}

export interface IModalDonateState {
    donationValues: {
        inputAmount: string;
        amountInDollars: number;
        backNBeneficiaries: number;
        backForDays: number;
    };
    community?: ICommunity;
    modalDonateOpen: boolean;
    modalConfirmOpen: boolean;
    modalErrorOpen: boolean;
    submitting: boolean;
}

export interface IAppState {
    kit: ContractKit;
    exchangeRates: any;
    suspectWrongDateTime: boolean;
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
    view: IViewState;
    app: IAppState;
    modalDonate: IModalDonateState;
}
