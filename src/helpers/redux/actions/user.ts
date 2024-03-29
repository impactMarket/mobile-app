import {
    SET_USER_CELO_INFO,
    SET_USER_INFO,
    SET_USER_EXCHANGE_RATE,
    SET_USER_LANGUAGE,
    SET_USER_WALLET_BALANCE,
    SET_USER_BENEFICIARY,
    SET_USER_IS_BLOCKED,
    SET_USER_IS_SUSPECT,
    SET_USER_MANAGER,
    SET_COMMUNITY_CONTRACT,
    SET_COMMUNITY,
    RESET_USER_APP,
} from 'helpers/constants';
import {
    BeneficiaryAttributes,
    CommunityAttributes,
    ManagerAttributes,
    UserAttributes,
} from 'helpers/types/models';
import { UserActionTypes } from 'helpers/types/redux';
import { IUserWallet } from 'helpers/types/state';

export function setUserWallet(wallet: IUserWallet): UserActionTypes {
    return {
        type: SET_USER_CELO_INFO,
        payload: wallet,
    };
}

export function setUserMetadata(userInfo: UserAttributes): UserActionTypes {
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

export function setUserBeneficiary(
    beneficiary: BeneficiaryAttributes
): UserActionTypes {
    return {
        type: SET_USER_BENEFICIARY,
        payload: beneficiary,
    };
}

export function setUserIsBlocked(isBlocked: boolean): UserActionTypes {
    return {
        type: SET_USER_IS_BLOCKED,
        payload: isBlocked,
    };
}

export function setUserIsSuspect(isSuspect: boolean): UserActionTypes {
    return {
        type: SET_USER_IS_SUSPECT,
        payload: isSuspect,
    };
}

export function setUserManager(manager: ManagerAttributes): UserActionTypes {
    return {
        type: SET_USER_MANAGER,
        payload: manager,
    };
}

export function setCommunityContract(community: any): UserActionTypes {
    return {
        type: SET_COMMUNITY_CONTRACT,
        payload: community,
    };
}

export function setCommunityMetadata(
    community: CommunityAttributes
): UserActionTypes {
    return {
        type: SET_COMMUNITY,
        payload: community,
    };
}

export function resetUserApp(): UserActionTypes {
    return {
        type: RESET_USER_APP,
        payload: {},
    };
}
