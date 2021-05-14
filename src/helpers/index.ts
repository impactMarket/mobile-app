import { ContractKit } from '@celo/contractkit';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking';
import * as Network from 'expo-network';
import {
    ICommunity,
    ICommunityLightDetails,
    IUserBaseAuth,
} from 'helpers/types/endpoints';
import moment from 'moment';
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
    // AppMediaContent,
    CommunityAttributes,
    UserAttributes,
} from './types/models';

export function generateUrlWithCloudFront(s3ContentKey: string) {
    // for backwards support
    // if (s3ContentKey.startsWith('http')) {
    // }
    // return `${config.cloudfrontUrl}/${s3ContentKey}`;
    return s3ContentKey;
}

export function makeDeeplinkUrl() {
    return Linking.makeUrl('/');
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

export function linkDeviceInfo(phoneNumber: string, identifier: string) {
    const buildId = Device.osInternalBuildId; // null only on web
    Network.getIpAddressAsync()
        .then((ip) =>
            Api.user.device(phoneNumber, identifier, buildId ? buildId : '', ip)
        )
        .catch(() =>
            Api.user.device(phoneNumber, identifier, buildId ? buildId : '', '')
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
    let identifier = '';
    if (Device.osName?.toLowerCase() === 'android') {
        identifier = Device.osBuildFingerprint!;
    } else {
        identifier = Device.osBuildId!;
    }
    linkDeviceInfo(phoneNumber, identifier);
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
        if (user.isBeneficiary || user.isManager) {
            const c = user.community!;
            const communityContract = new kit.web3.eth.Contract(
                CommunityContractABI as any,
                c.contractAddress!
            );
            dispatch(setCommunityMetadata(c));
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
    community: ICommunity | ICommunityLightDetails | CommunityAttributes
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

export function getCountryFromPhoneNumber(phoneNumber: string) {
    for (const [key, value] of Object.entries(countriesJSON)) {
        if (value.phone === phoneNumber.slice(1, value.phone.length + 1)) {
            return `${value.emoji} ${value.name}`;
        }
    }
    return 'Unknown';
}

export async function updateCommunityInfo(
    communityId: string,
    dispatch: Dispatch<any>
) {
    const community = await Api.community.getByPublicId(communityId);
    if (community !== undefined) {
        dispatch(setCommunityMetadata(community));
    }
}

export function validateEmail(email: string) {
    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email) return false;

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
