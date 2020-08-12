import { ContractKit } from '@celo/contractkit';

import {
    IUserCeloInfo,
    UserActionTypes,
    SET_USER_CELO_INFO,
    SET_CELO_KIT,
    SET_COMMUNITY_CONTRACT,
    SET_IMPACTMARKET_CONTRACT,
    NetworkActionTypes,
    SET_USER_WALLET_BALANCE,
    SET_USER_IS_COMMUNITY_MANAGER,
    SET_USER_IS_BENEFICIARY,
    RESET_USER_APP,
    RESET_NETWORK_APP,
    SET_USER_INFO,
    IUserInfo,
    ICommunityInfo,
    SET_COMMUNITY,
    AuthActionTypes,
    SET_PUSH_NOTIFICATION_TOKEN,
    SET_AUTH_TOKEN,
    SET_USER_EXCHANGE_RATE,
    SET_APP_PYMENT_TO_ACTION,
    AppActionTypes,
} from '../../types';

export function setUserCeloInfo(celoInfo: IUserCeloInfo): UserActionTypes {
    return {
        type: SET_USER_CELO_INFO,
        payload: celoInfo,
    };
}

export function setUserInfo(userInfo: IUserInfo): UserActionTypes {
    return {
        type: SET_USER_INFO,
        payload: userInfo,
    };
}

export function setUserExchangeRate(rate: number): UserActionTypes {
    return {
        type: SET_USER_EXCHANGE_RATE,
        payload: rate,
    };
}

export function setUserWalletBalance(balance: string): UserActionTypes {
    return {
        type: SET_USER_WALLET_BALANCE,
        payload: balance,
    };
}

export function setUserIsBeneficiary(isBeneficiary: boolean): UserActionTypes {
    return {
        type: SET_USER_IS_BENEFICIARY,
        payload: isBeneficiary,
    };
}

export function setUserIsCommunityManager(
    isCommunityManager: boolean
): UserActionTypes {
    return {
        type: SET_USER_IS_COMMUNITY_MANAGER,
        payload: isCommunityManager,
    };
}

export function setCeloKit(kit: ContractKit): NetworkActionTypes {
    return {
        type: SET_CELO_KIT,
        payload: kit,
    };
}

export function setImpactMarketContract(impactMarket: any): NetworkActionTypes {
    return {
        type: SET_IMPACTMARKET_CONTRACT,
        payload: impactMarket,
    };
}

export function setCommunityContract(community: any): NetworkActionTypes {
    return {
        type: SET_COMMUNITY_CONTRACT,
        payload: community,
    };
}

export function setCommunity(community: ICommunityInfo): NetworkActionTypes {
    return {
        type: SET_COMMUNITY,
        payload: community,
    };
}

export function setPushNotificationsToken(token: string): AuthActionTypes {
    return {
        type: SET_PUSH_NOTIFICATION_TOKEN,
        payload: token,
    };
}

export function setAuthToken(token: string): AuthActionTypes {
    return {
        type: SET_AUTH_TOKEN,
        payload: token,
    };
}

export function setAppPaymentToAction(
    paymentToAddress: string
): AppActionTypes {
    return {
        type: SET_APP_PYMENT_TO_ACTION,
        payload: paymentToAddress,
    };
}

export function resetUserApp(): UserActionTypes {
    return {
        type: RESET_USER_APP,
        payload: {},
    };
}

export function resetNetworkContractsApp(): NetworkActionTypes {
    return {
        type: RESET_NETWORK_APP,
        payload: {},
    };
}