// same as in api/types/models

import { UbiCommunityContract } from './ubi/ubiCommunityContract';
import { UbiCommunityDailyMetrics } from './ubi/ubiCommunityDailyMetrics';
import { UbiCommunityState } from './ubi/ubiCommunityState';
import { UbiOrganization } from './ubi/ubiOrganization';

export interface User {
    address: string;
    avatarMediaId: number | null;
    username: string | null;
    language: string;
    currency: string;
    pushNotificationToken: string | null;
    gender: string;
    year: number | null;
    children: number | null;
    lastLogin: Date;

    // timestamps
    createdAt: Date;
    updatedAt: Date;

    avatar?: AppMediaContent;
    // throughTrust?: AppUserTrust[];
    beneficiary?: BeneficiaryAttributes[];
    manager?: ManagerAttributes[];
}

export interface UbiCommunitySuspect {
    id: number;
    communityId: number;
    suspect: number;
    createdAt: boolean;
}
export interface UbiCommunity {
    id: number; // Note that the `null assertion` `!` is required in strict mode.
    publicId: string;
    requestByAddress: string;
    contractAddress: string | null;
    name: string;
    description: string;
    descriptionEn: string | null;
    language: string;
    currency: string;
    city: string;
    country: string;
    gps: {
        latitude: number;
        longitude: number;
    };
    email: string;
    visibility: 'public' | 'private';
    coverMediaId: number;
    status: 'pending' | 'valid' | 'removed'; // pending / valid / removed
    started: Date;

    // timestamps
    createdAt: Date;
    updatedAt: Date;

    cover?: AppMediaContent;
}
export interface CommunityAttributes extends UbiCommunity {
    metrics?: UbiCommunityDailyMetrics;
    contract?: UbiCommunityContract;
    state?: UbiCommunityState;
    suspect?: UbiCommunitySuspect;
    organization?: UbiOrganization;
}

export interface CommunityCampaing {
    communityId: number;
    campaignUrl: string;
}
export interface AppMediaThumbnail {
    id: number;
    mediaContentId: number;
    url: string;
    width: number;
    height: number;
    pixelRatio: number;
}
export interface AppMediaThumbnailCreation {
    mediaContentId: number;
    url: string;
    width: number;
    height: number;
    pixelRatio: number;
}
export interface AppMediaContent {
    id: number;
    url: string;
    width: number;
    height: number;

    thumbnails?: AppMediaThumbnail[];
}
export interface AppMediaContentCreation {
    url: string;
    width: number;
    height: number;
}

export interface CommunityStateAttributes {
    claimed: string;
    claims: number;
    beneficiaries: number;
    suspect: any[];
    removedBeneficiaries: number;
    managers: number;
    raised: string;
    backers: number;
}

export interface CommunityContractAttributes {
    claimAmount: string;
    maxClaim: string;
    baseInterval: number;
    incrementInterval: number;
}

export interface CommunityDailyMetricsAttributes {
    ssiDayAlone: number;
    ssi: number;
    ubiRate: number;
    estimatedDuration: number;
    date: Date;
}

export interface BeneficiaryAttributes {
    address: string;
    communityId: string;
    active: boolean;
    tx: string;
    txAt: Date;
    claims: number;
    claimed: string;
    blocked: boolean;
    lastClaimAt: Date | null;
    penultimateClaimAt: Date | null;
}

export interface ManagerAttributes {
    id: number;
    address: string;
    communityId: string;
    active: boolean;

    // timestamps
    createdAt: Date;
    updatedAt: Date;

    user?: User;
    community?: CommunityAttributes;
}

export interface UserAttributes {
    address: string;
    username: string | null;
    language: string;
    currency: string;
    avatar: string | null;
    // avatarMediaId: number | null;
    // pushNotificationToken: string | null;
    gender: string | null;
    year: number | null;
    children: number | null;
    blocked: boolean;
    suspect: boolean;
}

export interface IManagerAttributes {
    user: string;
    communityId: string;
}

export interface UbiRequestChangeParams {
    id: number;
    communityId: string;
    claimAmount: string;
    maxClaim: string;
    baseInterval: number;
    incrementInterval: number;
}
