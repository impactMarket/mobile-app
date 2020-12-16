import { ContractKit } from '@celo/contractkit';
import { ICommunity } from './endpoints';
import { IUser } from "./models";

export interface IUserWallet {
    address: string;
    phoneNumber: string;
    balance: string;
}

// state

export interface IUserState {
    wallet: IUserWallet;
    metadata: IUser;
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

export interface IAppState {
    kit: ContractKit;
    exchangeRates: any;
    suspectWrongDateTime: boolean;
    timeDiff: number;
    fromWelcomeScreen: string;
}

export interface IRootState {
    user: IUserState;
    // network: INetworkState;
    auth: IAuthState;
    app: IAppState;
}