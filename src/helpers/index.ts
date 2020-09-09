import { ContractKit } from '@celo/contractkit';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import Api from 'services/api';

import config from '../../config';
import CommunityContractABI from '../contracts/CommunityABI.json';
import ImpactMarketContractABI from '../contracts/ImpactMarketABI.json';
import { ImpactMarketInstance } from '../contracts/types/truffle-contracts';
import {
    setCommunityContract,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
    setImpactMarketContract,
    setCommunity,
} from './redux/actions/ReduxActions';
import { ICommunityInfo, IUser, IUserState, IUserInfo } from './types';

const usergetUserAvatars = [
    [
        require('assets/images/avatar/round/avatar1.png'),
        require('assets/images/avatar/round/avatar2.png'),
        require('assets/images/avatar/round/avatar3.png'),
        require('assets/images/avatar/round/avatar4.png'),
        require('assets/images/avatar/round/avatar5.png'),
        require('assets/images/avatar/round/avatar6.png'),
        require('assets/images/avatar/round/avatar7.png'),
        require('assets/images/avatar/round/avatar8.png'),
    ],
    [
        require('assets/images/avatar/square/avatar1.png'),
        require('assets/images/avatar/square/avatar2.png'),
        require('assets/images/avatar/square/avatar3.png'),
        require('assets/images/avatar/square/avatar4.png'),
        require('assets/images/avatar/square/avatar5.png'),
        require('assets/images/avatar/square/avatar6.png'),
        require('assets/images/avatar/square/avatar7.png'),
        require('assets/images/avatar/square/avatar8.png'),
    ],
];

export function getAvatarFromId(avatarId: number, big: boolean = false) {
    return usergetUserAvatars[big ? 0 : 1][avatarId];
}

export function getUserAvatar(user: IUserInfo, big: boolean = false) {
    if (user.avatar.length < 3) {
        return usergetUserAvatars[big ? 0 : 1][parseInt(user.avatar) - 1];
    }
    return { uri: user.avatar };
}

export function getUserCurrencySymbol(user: IUserInfo) {
    switch (user.currency.toUpperCase()) {
        case 'EUR':
            return '€';
        default:
            return '$';
    }
}

export function amountToUserCurrency(
    amount: BigNumber | string,
    user: IUserInfo
) {
    const exchangeRate = user.exchangeRate;
    const bgn = new BigNumber(amount).multipliedBy(exchangeRate);
    const result = humanifyNumber(bgn);
    return result;
}

export function claimFrequencyToText(frequency: BigNumber | string): string {
    const f = new BigNumber(frequency);
    if (f.eq(3601)) return i18n.t('hour');
    if (f.eq(86400)) return i18n.t('day');
    if (f.eq(604800)) return i18n.t('week');
    return 'month';
}

// cUSD has 18 zeros!
export function humanifyNumber(inputNumber: BigNumber | string): number {
    const decimals = new BigNumber(10).pow(config.cUSDDecimals);
    return parseFloat(new BigNumber(inputNumber).div(decimals).toFixed(2));
}

export function calculateCommunityProgress(
    toCalculte: string /*'raised' | 'claimed'*/,
    community: ICommunityInfo
): number {
    const m = new BigNumber(community.vars._maxClaim).multipliedBy(
        community.beneficiaries.added.length +
            community.beneficiaries.removed.length
    );
    const result = new BigNumber(
        toCalculte === 'raised' ? community.totalRaised : community.totalClaimed
    ).div(m.eq(0) ? 1 : m);
    return parseFloat(result.toFixed(2));
}

export function getCountryFromPhoneNumber(phoneNumber: string) {
    if (phoneNumber.slice(0, 4) === '+351') {
        return '🇵🇹 Portugal';
    }
}

export var iptcColors = {
    greenishTeal: '#2dce89',
    softBlue: '#5e72e4',
};

export async function loadContracts(
    address: string,
    kit: ContractKit,
    store: any
) {
    const fSetCommunity = (c: ICommunityInfo) => {
        // c.contractAddress can be null if community approval is still pending
        const communityContract = new kit.web3.eth.Contract(
            CommunityContractABI as any,
            c.contractAddress
        );
        store.dispatch(setCommunity(c));
        store.dispatch(setCommunityContract(communityContract));
    };
    const provider = new ethers.providers.Web3Provider(
        kit.web3.currentProvider as any
    );
    const impactMarketContract = new ethers.Contract(
        config.impactMarketContractAddress,
        ImpactMarketContractABI,
        provider
    ) as ethers.Contract & ImpactMarketInstance;
    store.dispatch(setImpactMarketContract(impactMarketContract));

    const isBeneficiary = await Api.findComunityToBeneficicary(address);
    if (isBeneficiary !== undefined) {
        store.dispatch(setUserIsBeneficiary(true));
        fSetCommunity(isBeneficiary);
        return;
    }
    const isManager = await Api.findComunityToManager(address);
    if (isManager !== undefined) {
        store.dispatch(setUserIsCommunityManager(true));
        fSetCommunity(isManager);
    }
}

export async function updateCommunityInfo(address: string, store: any) {
    const isBeneficiary = await Api.findComunityToBeneficicary(address);
    if (isBeneficiary !== undefined) {
        store.dispatch(setCommunity(isBeneficiary));
        return;
    }
    const isManager = await Api.findComunityToManager(address);
    if (isManager !== undefined) {
        store.dispatch(setCommunity(isManager));
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
