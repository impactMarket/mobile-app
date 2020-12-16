export interface CommunityAttributes {
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
    coverImage: string;
    status: 'pending' | 'valid' | 'removed'; // pending / valid / removed
    // txCreationObj: ICommunityVars | null;
    started: Date;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface CommunityStateAttributes {
    communityId: string;
    claimed: string;
    claims: number;
    beneficiaries: number;
    raised: string;
    backers: number;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface CommunityContractAttributes {
    communityId: string;
    claimAmount: string;
    maxClaim: string;
    baseInterval: number;
    incrementInterval: number;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface CommunityDailyMetricsAttributes {
    id: number;
    communityId: string;
    ssiDayAlone: number;
    ssi: number;
    ubiRate: number;
    estimatedDuration: number;
    date: Date;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

// replace the imports ^^^

// extra types

// adapted from the api model
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

// same as in api/types/models

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
