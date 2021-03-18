import { ContractKit } from '@celo/contractkit';
import { Subscription } from '@unimodules/core';
import * as Location from 'expo-location';
import { Dispatch } from 'redux';
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

export interface IPrivateCommunity {
    userAddress: string;
    claimAmount: string;
    maxClaim: string;
    baseInterval: string;
    incrementInterval: string;
    kit: ContractKit;
}

export interface IRouteParams {
    caller: string;
    community: string;
}

export interface IComunityDetails {
    userAddress: string;
    name: string;
    description: string;
    email: string;
    baseInterval: string;
    visibility: string;
    coverImage: string;
    city: string;
    country: string;
    gpsLocation: Location.LocationObject | undefined;
    claimAmount: string;
    incrementInterval: string;
    maxClaim: string;
}
export interface ISubmitNewCommunity {
    dispatch: Dispatch<any>;
    setIsCoverImageValid: React.SetStateAction<any>;
    setIsNameValid: React.SetStateAction<any>;
    setIsDescriptionValid: React.SetStateAction<any>;
    setIsCityValid: React.SetStateAction<any>;
    setIsCountryValid: React.SetStateAction<any>;
    setIsEmailValid: React.SetStateAction<any>;
    setIsEnabledGPS: React.SetStateAction<any>;
    setIsClaimAmountValid: React.SetStateAction<any>;
    setIsIncrementalIntervalValid: React.SetStateAction<any>;
    setIsMaxClaimValid: React.SetStateAction<any>;
    setSending: React.SetStateAction<any>;
    userLanguage: string;
    currency: string;
    comunityDetails: IComunityDetails;
    kit: ContractKit;
}

export interface IComunityEditDetails {
    userAddress: string;
    name: string;
    description: string;
    email: string;
}
export interface ISubmitEditCommunity {
    setIsNameValid: React.SetStateAction<any>;
    setIsDescriptionValid: React.SetStateAction<any>;
    setIsEmailValid: React.SetStateAction<any>;
    setSending: React.SetStateAction<any>;
    comunityDetails: IComunityEditDetails;
}
