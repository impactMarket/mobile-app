import { ICommunityInfo } from "./types";
import config from "../config";
import BigNumber from "bignumber.js";


export function claimFrequencyToText(frequency: BigNumber | string): string {
    const f = new BigNumber(frequency);
    if (f.eq(86400)) return 'day';
    if (f.eq(604800)) return 'week';
    return 'month';
}

// cUSD has 18 zeros!
export function humanifyNumber(inputNumber: BigNumber | string): string {
    const decimals = new BigNumber(10).pow(config.cUSDDecimals);
    return new BigNumber(inputNumber).div(decimals).toString();
}

export function calculateCommunityProgress(
    toCalculte: string /*'raised' | 'claimed'*/,
    community: ICommunityInfo
): number {
    if (toCalculte === 'raised') {
        const m = new BigNumber(community.vars._claimHardCap).multipliedBy(community.beneficiaries.length);
        const result = new BigNumber(community.totalRaised).div(m.eq(0) ? 1 : m);
        return result.toNumber();
    }
    const result = new BigNumber(community.totalClaimed)
        .div(new BigNumber(community.totalRaised).eq(0) ? 1 : community.totalRaised);
    return result.toNumber();
}

export var iptcColors = {
    greenishTeal: "#2dce89",
    softBlue: "#5e72e4"
}