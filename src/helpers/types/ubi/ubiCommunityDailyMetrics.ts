export interface UbiCommunityDailyMetrics {
    id: number;
    communityId: number;
    ssiDayAlone: number;
    ssi: number;
    ubiRate: number;
    estimatedDuration: number;
    date: Date;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
}
export interface UbiCommunityDailyMetricsCreation {
    communityId: number;
    ssiDayAlone: number;
    ssi: number;
    ubiRate: number;
    estimatedDuration: number;
    date: Date;
}
