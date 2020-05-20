import { ICommunityInfo } from "./types";
import { ethers } from "ethers";


export function calculateCommunityProgress(
    toCalculte: string /*'raised' | 'claimed'*/,
    community: ICommunityInfo
): number {
    if (toCalculte === 'raised') {
        const m = new ethers.utils.BigNumber(community.vars._claimHardCap).mul(community.beneficiaries.length);
        return new ethers.utils.BigNumber(community.totalRaised).div(m.eq(0) ? 1 : m).toNumber();
    }
    return new ethers.utils.BigNumber(community.totalClaimed)
        .div(new ethers.utils.BigNumber(community.totalRaised).eq(0) ? 1 : community.totalRaised).toNumber();
}