import { ICommunityInfo } from "./types";
import { ethers } from "ethers";
import config from "../config";


// cUSD has 18 zeros!
export function humanifyNumber(inputNumber: ethers.utils.BigNumber | string): string {
    return new ethers.utils.BigNumber(inputNumber).div(10 ** config.cUSDDecimals).toString();
}

export function calculateCommunityProgress(
    toCalculte: string /*'raised' | 'claimed'*/,
    community: ICommunityInfo
): number {
    if (toCalculte === 'raised') {
        const m = new ethers.utils.BigNumber(community.vars._claimHardCap).mul(community.beneficiaries.length);
        const result = new ethers.utils.BigNumber(community.totalRaised).div(m.eq(0) ? 1 : m);
        return result.div(10 ** config.cUSDDecimals).toNumber();
    }
    const result = new ethers.utils.BigNumber(community.totalClaimed)
        .div(new ethers.utils.BigNumber(community.totalRaised).eq(0) ? 1 : community.totalRaised);
    return result.div(10 ** config.cUSDDecimals).toNumber();
}