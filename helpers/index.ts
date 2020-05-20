import { ICommunityViewInfo } from "./types";


export function calculateCommunityProgress(
    toCalculte: string /*'raised' | 'claimed'*/,
    community: ICommunityViewInfo
): number {
    if (toCalculte === 'raised') {
        const m = community.vars!._claimHardCap.mul(community.beneficiaries.length);
        return community.totalRaised.div(m.eq(0) ? 1 : m).toNumber();
    }
    return community.totalClaimed
        .div(community.totalRaised.eq(0) ? 1 : community.totalRaised).toNumber();
}