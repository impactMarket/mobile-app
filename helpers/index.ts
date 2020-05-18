import { ICommunityViewInfo } from "./types";


export function calculateCommunityProgress(
    toCalculte: string /*'raised' | 'claimed'*/,
    community: ICommunityViewInfo
): number {
    if (toCalculte === 'raised') {
        return community.totalRaised.div(community.vars!._claimHardCap
            .mul(community.beneficiaries.length)).toNumber();
    }
    return community.totalClaimed
        .div(community.totalRaised.eq(0) ? 1 : community.totalRaised).toNumber();
}