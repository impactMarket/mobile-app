import { ContractKit } from '@celo/contractkit';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { Store, CombinedState } from 'redux';
import Api from 'services/api';

import config from '../../config';
import CommunityContractABI from '../contracts/CommunityABI.json';
import {
    setCommunityContract,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
    setCommunity,
    initUser,
} from './redux/actions/ReduxActions';
import {
    AppActionTypes,
    AuthActionTypes,
    IAppState,
    IAuthState,
    ICommunityInfo,
    INetworkState,
    IUserInfo,
    IUserState,
    IUserWelcome,
    NetworkActionTypes,
    UserActionTypes,
} from './types';

const avatarRound1 = require('assets/images/avatar/round/avatar1.png');
const avatarSquare1 = require('assets/images/avatar/square/avatar1.png');

const usergetUserAvatars = [
    [
        avatarRound1,
        avatarRound1,
        avatarRound1,
        avatarRound1,
        avatarRound1,
        avatarRound1,
        avatarRound1,
        avatarRound1,
    ],
    [
        avatarSquare1,
        avatarSquare1,
        avatarSquare1,
        avatarSquare1,
        avatarSquare1,
        avatarSquare1,
        avatarSquare1,
        avatarSquare1,
    ],
];

export async function getUserBalance(kit: ContractKit, address: string) {
    const stableToken = await kit.contracts.getStableToken();
    const cUSDBalanceBig = await stableToken.balanceOf(address);
    return new BigNumber(cUSDBalanceBig.toString());
}

export async function welcomeUser(
    address: string,
    phoneNumber: string,
    user: IUserWelcome,
    kit: ContractKit,
    store: Store<
        CombinedState<{
            user: IUserState;
            network: INetworkState;
            auth: IAuthState;
            app: IAppState;
        }>,
        UserActionTypes | NetworkActionTypes | AuthActionTypes | AppActionTypes
    >
) {
    const balance = await getUserBalance(kit, address);
    let language = user.user.language;
    i18n.locale = language;
    moment.locale(language);
    store.dispatch(
        initUser({
            ...user,
            user: {
                ...user.user,
                phoneNumber,
                balance: balance.toString(),
            },
        })
    );
    if (user.isBeneficiary || user.isManager) {
        const c = user.community!;
        const communityContract = new kit.web3.eth.Contract(
            CommunityContractABI as any,
            c.contractAddress
        );
        store.dispatch(setCommunity(c));
        store.dispatch(setCommunityContract(communityContract));
    }
}

export function formatInputAmountToTransfer(inputAmount: string) {
    if (inputAmount.indexOf(',') === 0 || inputAmount.indexOf('.') === 0) {
        inputAmount = `0${inputAmount}`;
    }
    inputAmount = inputAmount.replace(',', '.');
    return inputAmount;
}

export function getAvatarFromId(avatarId: number, round: boolean = true) {
    return usergetUserAvatars[round ? 0 : 1][avatarId];
}

export function getUserAvatar(user: IUserInfo, round: boolean = true) {
    if (user.avatar.length < 3) {
        return usergetUserAvatars[round ? 0 : 1][parseInt(user.avatar) - 1];
    }
    return { uri: user.avatar };
}

export function getCurrencySymbol(currency: string) {
    switch (currency.toUpperCase()) {
        case 'EUR':
            return '€';
        case 'BRL':
            return 'R$';
        case 'GHS':
            return 'GH₵';
        case 'CVE':
            return '$';
        default:
            return '$';
    }
}

/**
 * @deprecated Use getCurrencySymbol
 */
export function getUserCurrencySymbol(user: IUserInfo) {
    switch (user.currency.toUpperCase()) {
        case 'EUR':
            return '€';
        case 'BRL':
            return 'R$';
        case 'GHS':
            return 'GH₵';
        case 'CVE':
            return '$';
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
    return parseFloat(new BigNumber(inputNumber).div(decimals).toFixed(2, 1));
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
    } else if (phoneNumber.slice(0, 3) === '+55') {
        return '🇧🇷 Brazil';
    } else if (phoneNumber.slice(0, 4) === '+233') {
        return '🇬🇭 Ghana';
    }
    return '';
}

export var iptcColors = {
    greenishTeal: '#2dce89',
    softBlue: '#5e72e4',
};

/**
 * @deprecated
 */
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
    const isBeneficiary = await Api.findComunityToBeneficicary(address);
    if (isBeneficiary !== undefined) {
        store.dispatch(setUserIsBeneficiary(true));
        fSetCommunity(isBeneficiary);
        return 1;
    }
    const isManager = await Api.findComunityToManager(address);
    if (isManager !== undefined) {
        store.dispatch(setUserIsCommunityManager(true));
        fSetCommunity(isManager);
        return 0;
    }
    return -1;
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
