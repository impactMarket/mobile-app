import {
    CommunityAttributes,
    CommunityContractAttributes,
    CommunityDailyMetricsAttributes,
    CommunityStateAttributes,
    UserAttributes,
} from './models';

export interface ICommunityLightDetails {
    publicId: string;
    contractAddress: string;
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

export interface IManagers {
    managers: number;
    beneficiaries: {
        active: number;
        inactive: number;
    };
}

export interface IManagerDetailsManager {
    address: string;
    username: string | null;
    timestamp: number;
}

export interface IManagerDetailsBeneficiary {
    address: string;
    username: string | null;
    timestamp: number;
    claimed: string;
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
    // coverImage: string; // default image is used
    contractParams: {
        claimAmount: string;
        maxClaim: string;
        baseInterval: number;
        incrementInterval: number;
    };
}

export interface IUserBaseAuth {
    isBeneficiary: boolean;
    isManager: boolean;
    community?: ICommunity;
}

export interface IUserHello extends IUserBaseAuth {
    rates: { currency: string; rate: number }[];
}

export interface IUserAuth extends IUserBaseAuth {
    user: UserAttributes;
    token: string;
}
