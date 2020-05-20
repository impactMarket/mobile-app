import { ICommunityInfo } from "./types";
import { ethers } from "ethers";


export function calculateCommunityProgress(
    toCalculte: string /*'raised' | 'claimed'*/,
    community: ICommunityInfo
): number {
    // cUSD has 18 zeros!
    const decimals = new ethers.utils.BigNumber(10).pow(18);
    if (toCalculte === 'raised') {
        const m = new ethers.utils.BigNumber(community.vars._claimHardCap).mul(community.beneficiaries.length);
        const result = new ethers.utils.BigNumber(community.totalRaised).div(m.eq(0) ? 1 : m);
        return result.div(decimals).toNumber();
    }
    const result = new ethers.utils.BigNumber(community.totalClaimed)
        .div(new ethers.utils.BigNumber(community.totalRaised).eq(0) ? 1 : community.totalRaised);
    return result.div(decimals).toNumber();
}