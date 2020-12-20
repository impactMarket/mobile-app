import {
    CommunityAttributes,
    CommunityContractAttributes,
    CommunityDailyMetricsAttributes,
    CommunityStateAttributes,
    UserAttributes,
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

export interface IManagersDetails {
    managers: IManagerDetailsManager[];
    beneficiaries: {
        active: IManagerDetailsBeneficiary[];
        inactive: IManagerDetailsBeneficiary[];
    };
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

export interface IUserHello {
    exchangeRates: any; // TODO: this is not really an any
    isBeneficiary: boolean;
    isManager: boolean;
    community?: ICommunity;
}

export interface IUserAuth extends IUserHello {
    user: UserAttributes;
    token: string;
}
