export interface UbiCommunityState {
    communityId: number;
    claimed: string;
    claims: number;
    beneficiaries: number; // only in community
    removedBeneficiaries: number;
    managers: number;
    contributed: string;
    contributors: number;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface UbiCommunityStateCreation {
    communityId: number;
}
