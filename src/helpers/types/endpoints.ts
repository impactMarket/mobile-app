import {
    CommunityAttributes,
    CommunityContractAttributes,
    CommunityDailyMetricsAttributes,
    CommunityStateAttributes,
} from './models';

export interface ICommunityLightDetails {
    publicId: string;
    name: string;
    city: string;
    country: string;
    coverImage: string;
    state: CommunityStateAttributes;
    contract: CommunityContractAttributes;
}
export interface ICommunity extends CommunityAttributes {
    state: CommunityStateAttributes;
    contract: CommunityContractAttributes;
    metrics: CommunityDailyMetricsAttributes;
}

//
export interface CommunityCreationAttributes {
    requestByAddress: string;
    contractAddress?: string;
    name: string;
    description: string;
    language: string;
    currency: string;
    city: string;
    country: string;
    gps: {
        latitude: number;
        longitude: number;
    };
    email: string;
    txReceipt?: any;
    coverImage: string;
    contractParams: {
        claimAmount: string;
        maxClaim: string;
        baseInterval: number;
        incrementInterval: number;
    };
}

export interface IUserWelcome {
    exchangeRates: any; // TODO: this is not really an any
    isBeneficiary: boolean;
    isManager: boolean;
    community?: ICommunity;
}

export interface IUserWelcomeAuth extends IUserWelcome {
    token: string;
}
