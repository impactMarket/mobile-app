import { ContractKit } from '@celo/contractkit';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { Dispatch } from 'redux';
import Api from 'services/api';

import CommunityContractABI from '../contracts/CommunityABI.json';
import * as Linking from 'expo-linking';
import {
    ICommunity,
    ICommunityLightDetails,
    IUserHello,
} from 'helpers/types/endpoints';
import { batch } from 'react-redux';
import {
    setCommunityContract,
    setCommunityMetadata,
    setUserExchangeRate,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
    setUserMetadata,
    setUserWallet,
} from './redux/actions/user';
import { setAppExchangeRatesAction } from './redux/actions/app';
import { UserAttributes } from './types/models';
import config from '../../config';
import countriesJSON from 'assets/countries.json';

export function generateUrlWithCloudFront(s3ContentKey: string) {
    // for backwards support
    if (s3ContentKey.startsWith('http')) {
        return s3ContentKey;
    }
    return `${config.cloudfrontUrl}/${s3ContentKey}`;
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

export async function welcomeUser(
    address: string,
    phoneNumber: string,
    user: IUserHello,
    kit: ContractKit,
    dispatch: Dispatch<any>,
    userMetadata: UserAttributes
) {
    const balance = await getUserBalance(kit, address);
    let language = userMetadata.language;
    if (i18n.language !== language) {
        i18n.changeLanguage(language);
        moment.locale(language);
    }
    batch(() => {
        dispatch(
            setUserWallet({
                address,
                phoneNumber,
                balance: balance.toString(),
            })
        );
        dispatch(setUserMetadata(userMetadata));
        dispatch(
            setUserExchangeRate(
                user.exchangeRates[userMetadata.currency.toUpperCase()].rate
            )
        );
        dispatch(setAppExchangeRatesAction(user.exchangeRates));
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
    community: ICommunity | ICommunityLightDetails
): number {
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
    for (var [key, value] of Object.entries(countriesJSON)) {
        if (
            value.phone ===
            phoneNumber.slice(1, value.phone.length + 1)
        ) {
            return `${value.emoji} ${value.name}`
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

    var valid = emailRegex.test(email);
    if (!valid) return false;

    // Further checking of some things regex can't handle
    var parts = email.split('@');
    if (parts[0].length > 64) return false;

    var domainParts = parts[1].split('.');
    if (
        domainParts.some(function (part) {
            return part.length > 63;
        })
    )
        return false;

    return true;
}
