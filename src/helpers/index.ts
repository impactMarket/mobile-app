import { ContractKit } from '@celo/contractkit';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import * as Linking from 'expo-linking';
import { IUserBaseAuth } from 'helpers/types/endpoints';
import parsePhoneNumber from 'libphonenumber-js';
import moment from 'moment';
import { PixelRatio } from 'react-native';
import { batch } from 'react-redux';
import { Dispatch } from 'redux';
import Api from 'services/api';

import config from '../../config';
import CommunityContractABI from '../contracts/CommunityABI.json';
import {
    setCommunityContract,
    setCommunityMetadata,
    setUserExchangeRate,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
    setUserMetadata,
    setUserWallet,
    setUserIsBlocked,
    setUserIsSuspect,
} from './redux/actions/user';
import {
    AppMediaContent,
    CommunityAttributes,
    UserAttributes,
} from './types/models';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;

export function makeDeeplinkUrl() {
    return Linking.makeUrl('/');
}

export function chooseMediaThumbnail(
    media: AppMediaContent,
    size: { heigth: number; width: number }
) {
    if (media.thumbnails) {
        const thumbnails = media.thumbnails.filter(
            (t) => t.height === size.heigth && t.width === size.width
        );
        if (thumbnails.length > 0) {
            const thumbnail = thumbnails.find(
                (t) => t.pixelRatio === PixelRatio.get()
            );
            if (thumbnail) {
                return thumbnail.url;
            }
            return thumbnails[0].url;
        }
    }
    return media.url;
}

export async function isOutOfTime() {
    let tries = 3;
    let totalDiff = 0;
    while (--tries >= 0) {
        const preTime = new Date();
        const serverTime = await Api.system.getServerTime();
        const postTime = new Date();
        const requestDiff = moment(preTime).diff(postTime);
        totalDiff +=
            new Date(postTime.getTime() - requestDiff / 2).getTime() -
            serverTime;
    }
    const timeDiff = totalDiff / 3;
    return (
        timeDiff < -config.outOfTimeThreshold ||
        timeDiff > config.outOfTimeThreshold
    );
}

export async function welcomeUser(
    address: string,
    phoneNumber: string,
    user: IUserBaseAuth,
    rates: { [key: string]: number },
    kit: ContractKit,
    dispatch: Dispatch<any>,
    userMetadata: UserAttributes
) {
    const balance = await getUserBalance(kit, address);
    const { language } = userMetadata;
    if (i18n.language !== language) {
        i18n.changeLanguage(language);
        moment.locale(language);
    }
    let community: CommunityAttributes | undefined;
    if (user.isBeneficiary || user.isManager) {
        community = await Api.community.findById(user.communityId!);
    }
    batch(() => {
        dispatch(
            setUserWallet({
                address,
                phoneNumber,
                balance: balance.toString(),
            })
        );
        if (
            (user as any).user !== undefined && // TODO: avoid this
            (user as any).user.avatar !== null // TODO: avoid this
        ) {
            dispatch(
                setUserMetadata({
                    ...userMetadata,
                    avatar: (user as any).user.avatar
                        ? (user as any).user.avatar.url
                        : null, // TODO: avoid this
                })
            );
        } else {
            dispatch(setUserMetadata(userMetadata));
        }
        // const allExchangeRates: { [key: string]: number } = {};
        // Object.assign(
        //     allExchangeRates,
        //     ...user.rates.map((y) => ({ [y.currency]: y.rate }))
        // );
        dispatch(
            setUserExchangeRate(rates[userMetadata.currency.toUpperCase()])
        );
        // dispatch(setAppExchangeRatesAction(allExchangeRates));
        if (community) {
            // const c = await Api.community.findById(user.communityId!);
            const communityContract = new kit.web3.eth.Contract(
                CommunityContractABI as any,
                community.contractAddress!
            );
            dispatch(setCommunityMetadata(community));
            dispatch(setCommunityContract(communityContract));
            dispatch(setUserIsBeneficiary(user.isBeneficiary));
            dispatch(setUserIsCommunityManager(user.isManager));
            // Setting suspicious activity
            dispatch(setUserIsBlocked(user.blocked));
            dispatch(setUserIsSuspect(user.suspect));
        }
    });
}

export async function getUserBalance(kit: ContractKit, address: string) {
    const stableToken = await kit.contracts.getStableToken();
    const cUSDBalanceBig = await stableToken.balanceOf(address);
    return new BigNumber(cUSDBalanceBig.toString());
}

export function claimFrequencyToText(frequency: number): string {
    if (frequency === 86400) return i18n.t('daily');
    if (frequency === 604800) return i18n.t('weekly');
    return 'unknown';
}

export function calculateCommunityProgress(
    toCalculte: string /*'raised' | 'claimed'*/,
    community: CommunityAttributes
): number {
    if (community.contract === undefined || community.state === undefined) {
        return 0;
    }
    const m = new BigNumber(community.contract.maxClaim).multipliedBy(
        community.state.beneficiaries
    );
    const result = new BigNumber(
        toCalculte === 'raised'
            ? community.state.raised
            : community.state.claimed
    ).div(m.eq(0) ? 1 : m);
    return parseFloat(result.decimalPlaces(5, 1).toString());
}
export function calculateCommunityRemainedFunds(
    community: CommunityAttributes
): number {
    if (community.contract === undefined || community.state === undefined) {
        return 0;
    }

    const raised = new BigNumber(community.state.raised);
    const claimed = new BigNumber(community.state.claimed);
    const ubiRate = community.metrics?.ubiRate ?? 0;
    const beneficiaryCount = community.state.beneficiaries;

    const remainingFundToBeClaimed =
        raised.toNumber() - claimed.toNumber() / ubiRate / beneficiaryCount;

    const claimAmountPerBeneficiary = new BigNumber(
        community.contract.claimAmount
    );

    const communityLimitPerDay =
        claimAmountPerBeneficiary.toNumber() * beneficiaryCount;

    const remainingDays = remainingFundToBeClaimed / communityLimitPerDay;

    return remainingDays <= 1 ? 1 : Math.round(remainingDays);
}

export function getCountryFromPhoneNumber(pnumber: string) {
    const phoneNumber = parsePhoneNumber(pnumber);
    if (phoneNumber && phoneNumber.country) {
        const { emoji, name } = countries[phoneNumber.country];
        return `${emoji} ${name}`;
    }
    return 'Unknown';
}

export function getCurrencyFromPhoneNumber(pnumber: string) {
    const phoneNumber = parsePhoneNumber(pnumber);
    if (phoneNumber && phoneNumber.country) {
        return countries[phoneNumber.country].currency;
    } else {
        return 'USD';
    }
}

export async function updateCommunityInfo(
    communityId: number,
    dispatch: Dispatch<any>
) {
    const community = await Api.community.findById(communityId);
    if (community !== undefined) {
        dispatch(setCommunityMetadata(community));
    }
}

export function validateEmail(email: string) {
    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email) return false;

    if (email.length === 0) return false;

    if (email.length > 254) return false;

    const valid = emailRegex.test(email);
    if (!valid) return false;

    // Further checking of some things regex can't handle
    const parts = email.split('@');
    if (parts[0].length > 64) return false;

    const domainParts = parts[1].split('.');
    if (
        domainParts.some(function (part) {
            return part.length > 63;
        })
    )
        return false;

    return true;
}
