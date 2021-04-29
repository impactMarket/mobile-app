export interface UbiCommunityContract {
    communityId: number;
    claimAmount: string;
    maxClaim: string;
    baseInterval: number;
    incrementInterval: number;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface UbiCommunityContractCreation {
    communityId: number;
    claimAmount: string;
    maxClaim: string;
    baseInterval: number;
    incrementInterval: number;
}
