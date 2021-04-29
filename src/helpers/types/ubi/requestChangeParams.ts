export interface UbiRequestChangeParams {
    id: number;
    communityId: string;
    claimAmount: string;
    maxClaim: string;
    baseInterval: number;
    incrementInterval: number;
}
export interface UbiRequestChangeParamsCreation {
    communityId: string;
    claimAmount: string;
    maxClaim: string;
    baseInterval: number;
    incrementInterval: number;
}
