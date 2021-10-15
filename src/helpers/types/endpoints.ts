import {
    AppMediaContent,
    BeneficiaryAttributes,
    ManagerAttributes,
    UbiCommunity,
    UserAttributes,
} from './models';
import { UbiCommunityContract } from './ubi/ubiCommunityContract';
import { UbiCommunityState } from './ubi/ubiCommunityState';
import { UbiCommunitySuspect } from './ubi/ubiCommunitySuspect';

export interface ApiErrorReturn {
    name: string;
    message: string;
}

export interface CommunityListRequestParams {
    offset: number;
    limit: number;
    orderBy?: string;
    filter?: 'featured';
    lat?: number;
    lng?: number;
}

export interface CommunityListResult extends UbiCommunity {
    suspect?: UbiCommunitySuspect[];
    contract?: UbiCommunityContract;
    state?: UbiCommunityState;
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
export interface IBeneficiaryActivities {
    id: number;
    type: string;
    tx: string;
    date: Date;
    withAddress?: string;
    isFromBeneficiary?: boolean;
    amount?: string;
    username?: string;
}
export interface CommunityEditionAttributes {
    name: string;
    description: string;
    currency: string;
    coverMediaId: number;
}
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
    communityId?: number;
    suspect: UserAttributes['suspect'];
    blocked: boolean;
    beneficiary: BeneficiaryAttributes | null;
    manager: ManagerAttributes | null;
}

export interface IUserHello extends IUserBaseAuth {}

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
    userReported: boolean;
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
