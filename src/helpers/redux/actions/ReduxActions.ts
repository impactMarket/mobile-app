import { ContractKit } from '@celo/contractkit';

import {
    IUserCeloInfo,
    UserActionTypes,
    SET_USER_CELO_INFO,
    SET_CELO_KIT,
    SET_COMMUNITY_CONTRACT,
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
    AppActionTypes,
    SET_USER_LANGUAGE,
    INIT_USER,
    IInitUser,
    SET_EXCHANGE_RATES,
    SET_APP_SUSPECT_WRONG_DATETIME,
    SET_APP_FROM_WELCOME_SCREEN,
} from '../../types';

export function setUserCeloInfo(celoInfo: IUserCeloInfo): UserActionTypes {
    return {
        type: SET_USER_CELO_INFO,
        payload: celoInfo,
    };
}

export function initUser(user: IInitUser): UserActionTypes {
    return {
        type: INIT_USER,
        payload: user,
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

export function setUserLanguage(language: string): UserActionTypes {
    return {
        type: SET_USER_LANGUAGE,
        payload: language,
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

export function setCeloKit(kit: ContractKit): AppActionTypes {
    return {
        type: SET_CELO_KIT,
        payload: kit,
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

export function setAppSuspectWrongDateTime(
    suspect: boolean,
    timeDiff: number,
): AppActionTypes {
    return {
        type: SET_APP_SUSPECT_WRONG_DATETIME,
        payload: {
            suspect,
            timeDiff,
        },
    };
}

export function SetAppFromWelcomeScreen(
    nextScreen: string
): AppActionTypes {
    return {
        type: SET_APP_FROM_WELCOME_SCREEN,
        payload: nextScreen,
    };
}

export function setAppExchangeRatesAction(exchangeRates: any): AppActionTypes {
    return {
        type: SET_EXCHANGE_RATES,
        payload: exchangeRates,
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
