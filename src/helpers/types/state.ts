import { ContractKit } from '@celo/contractkit';
import { ICommunity, IManagersDetails } from './endpoints';
import { UserAttributes } from "./models";

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
    }
}

export interface IAuthState {
    pushNotificationToken: string;
    authToken: string;
}

export interface IViewState {
    managerDetails?: IManagersDetails;
}

export interface IAppState {
    kit: ContractKit;
    exchangeRates: any;
    suspectWrongDateTime: boolean;
    timeDiff: number;
    fromWelcomeScreen: string;
}

export interface IRootState {
    user: IUserState;
    auth: IAuthState;
    view: IViewState;
    app: IAppState;
}