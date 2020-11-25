import { ContractKit } from '@celo/contractkit';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { Store, CombinedState, Dispatch } from 'redux';
import Api from 'services/api';

import config from '../../config';
import CommunityContractABI from '../contracts/CommunityABI.json';
import {
    setCommunityContract,
    setCommunity,
    initUser,
    setAppExchangeRatesAction,
} from './redux/actions/ReduxActions';
import {
    AppActionTypes,
    AuthActionTypes,
    IAppState,
    IAuthState,
    ICommunityInfo,
    INetworkState,
    IUserState,
    IUserWelcome,
    NetworkActionTypes,
    UserActionTypes,
} from './types';
import * as Linking from 'expo-linking';

export function makeDeeplinkUrl() {
    return Linking.makeUrl('/');
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
    if (i18n.language !== language) {
        i18n.changeLanguage(language);
        moment.locale(language);
    }
    store.dispatch(setAppExchangeRatesAction(user.exchangeRates));
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

export async function getUserBalance(kit: ContractKit, address: string) {
    const stableToken = await kit.contracts.getStableToken();
    const cUSDBalanceBig = await stableToken.balanceOf(address);
    return new BigNumber(cUSDBalanceBig.toString());
}

export function claimFrequencyToText(frequency: BigNumber | string): string {
    const f = new BigNumber(frequency);
    if (f.eq(86400)) return i18n.t('daily');
    if (f.eq(604800)) return i18n.t('weekly');
    return 'unknown';
}

export function calculateCommunityProgress(
    toCalculte: string /*'raised' | 'claimed'*/,
    community: ICommunityInfo
): number {
    const m = new BigNumber(community.contractParams.maxClaim).multipliedBy(
        community.beneficiaries.added.length // + community.beneficiaries.removed.length
    );
    const result = new BigNumber(
        toCalculte === 'raised' ? community.state.raised : community.state.claimed
    ).div(m.eq(0) ? 1 : m);
    return parseFloat(result.decimalPlaces(5, 1).toString());
}

export function getCountryFromPhoneNumber(phoneNumber: string) {
    if (phoneNumber.slice(0, 4) === '+351') {
        return '🇵🇹 Portugal';
    } else if (phoneNumber.slice(0, 3) === '+55') {
        return '🇧🇷 Brasil';
    } else if (phoneNumber.slice(0, 2) === '+1') {
        return '🇺🇸 United States of America';
    } else if (phoneNumber.slice(0, 3) === '+62') {
        return '🇮🇩 Indonesia';
    } else if (phoneNumber.slice(0, 3) === '+91') {
        return '🇮🇳 India';
    } else if (phoneNumber.slice(0, 4) === '+233') {
        return '🇬🇭 Ghana';
    } else if (phoneNumber.slice(0, 4) === '+238') {
        return '🇨🇻 Cabo Verde';
    } else if (phoneNumber.slice(0, 4) === '+234') {
        return '🇳🇬 Nigeria';
    } else if (phoneNumber.slice(0, 3) === '+54') {
        return '🇦🇷 Argentina';
    } else if (phoneNumber.slice(0, 3) === '+58') {
        return '🇻🇪 Venezuela';
    } else if (phoneNumber.slice(0, 3) === '+63') {
        return '🇵🇭 Philippines';
    }
    return 'Unknown';
}

export async function updateCommunityInfo(
    communityId: string,
    dispatch: Dispatch<any>
) {
    const community = await Api.getCommunityByPublicId(communityId);
    if (community !== undefined) {
        dispatch(setCommunity(community));
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
