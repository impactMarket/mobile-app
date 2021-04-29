export interface UbiCommunityState {
    communityId: number;
    claimed: string;
    claims: number;
    beneficiaries: number; // only in community
    removedBeneficiaries: number;
    managers: number;
    raised: string;
    backers: number;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface UbiCommunityStateCreation {
    communityId: number;
}
