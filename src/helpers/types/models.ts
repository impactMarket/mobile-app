// same as in api/types/models

export interface CommunityAttributes {
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
    status: 'pending' | 'valid' | 'removed';
    started: Date;
}

export interface CommunityStateAttributes {
    claimed: string;
    claims: number;
    beneficiaries: number;
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
    lastClaimAt: Date | null;
    penultimateClaimAt: Date | null;
};

export interface ManagerAttributes {
    user: string;
    communityId: string;
};


export interface UserAttributes {
    address: string;
    username: string | null;
    language: string;
    currency: string;
    // pushNotificationToken: string | null;
    gender: string | null;
    age: number | null;
    childs: number | null;
};