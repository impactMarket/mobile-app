import {
    AppMediaContent,
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
    cover: IMediaContent;
    state: CommunityStateAttributes;
    contract: CommunityContractAttributes;
    blocked: boolean;
    verifiedPN: boolean | undefined;
    suspect: boolean | undefined;
}

export interface ICommunityDetails {
    publicId: string;
    contractAddress: string;
    name: string;
    city: string;
    country: string;
    coverImage: string;
    cover: IMediaContent;
    state: CommunityStateAttributes;
    contract: CommunityContractAttributes;
    blocked: boolean;
    verifiedPN: boolean | undefined;
    suspect: boolean | undefined;
}
export interface ICommunity extends CommunityAttributes {
    state: CommunityStateAttributes;
    contract: CommunityContractAttributes;
    metrics: CommunityDailyMetricsAttributes;
}

/**
 * @deprecated use AppMediaContent
 */
export interface IMediaContent {
    id: number;
    url: string;
    width: number;
    height: number;
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
    // suspect: boolean | undefined;
}

export interface IManagerDetailsBeneficiary {
    address: string;
    username: string | null;
    timestamp: number;
    claimed: string;
    blocked: boolean;
    verifiedPN: boolean | undefined;
    suspect: boolean | undefined;
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
    coverMediaId?: number;
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
    suspect: UserAttributes['suspect'];
    blocked: boolean;
}

export interface IUserHello extends IUserBaseAuth {
    rates: { currency: string; rate: number }[];
    verifiedPN: boolean | undefined;
}

export interface IUserAuth extends IUserBaseAuth {
    avatar: AppMediaContent | null;
    user: UserAttributes;
    token: string;
}

export interface ICommunityStory {
    id: number;
    media: AppMediaContent | null;
    message: string | null;
    byAddress: string;
    loves: number;
    userLoved: boolean;
}

export interface ICommunitiesListStories {
    id: number;
    name: string;
    // coverImage: string;
    cover: AppMediaContent;
    story: {
        id: number;
        media: AppMediaContent | null;
        message: string | null;
    }; // most recent
}

export interface ICommunityStories {
    id: number;
    name: string;
    cover: AppMediaContent;
    stories: ICommunityStory[];
    // publicId: string; // temporary
    city: string;
    country: string;
    // coverImage: string;
}
