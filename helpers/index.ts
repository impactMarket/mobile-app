import { ICommunityInfo } from "./types";
import { ethers } from "ethers";
import config from "../config";


export function claimFrequencyToText(frequency: ethers.utils.BigNumber | string): string {
    const f = new ethers.utils.BigNumber(frequency);
    if (f.eq(86400)) return 'day';
    if (f.eq(604800)) return 'week';
    return 'month';
}

// cUSD has 18 zeros!
export function humanifyNumber(inputNumber: ethers.utils.BigNumber | string): string {
    const decimals = new ethers.utils.BigNumber(10).pow(config.cUSDDecimals);
    return new ethers.utils.BigNumber(inputNumber).div(decimals).toString();
}

export function calculateCommunityProgress(
    toCalculte: string /*'raised' | 'claimed'*/,
    community: ICommunityInfo
): number {
    const decimals = new ethers.utils.BigNumber(10).pow(config.cUSDDecimals);
    if (toCalculte === 'raised') {
        const m = new ethers.utils.BigNumber(community.vars._claimHardCap).mul(community.beneficiaries.length);
        const result = new ethers.utils.BigNumber(community.totalRaised).div(m.eq(0) ? 1 : m);
        return result.div(decimals).toNumber();
    }
    const result = new ethers.utils.BigNumber(community.totalClaimed)
        .div(new ethers.utils.BigNumber(community.totalRaised).eq(0) ? 1 : community.totalRaised);
    return result.div(decimals).toNumber();
}