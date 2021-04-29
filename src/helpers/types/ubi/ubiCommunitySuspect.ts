export interface UbiCommunitySuspect {
    id: number;
    communityId: number;
    percentage: number;
    suspect: number;
    createdAt: boolean;
}
export interface UbiCommunitySuspectCreation {
    communityId: number;
    percentage: number;
    suspect: number;
}
