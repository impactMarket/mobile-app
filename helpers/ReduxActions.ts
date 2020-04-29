import {
    IUserCeloInfo,
    UserActionTypes,
    SET_USER_CELO_INFO,
    SET_CELO_KIT,
    SET_COMMUNITY_CONTRACT,
    SET_IMPACTMARKET_CONTRACT,
    NetworkActionTypes,
    SET_USER_WALLET_BALANCE,
    SET_USER_FIRST_TIME,
    SET_USER_IS_COMMUNITY_COORDINATOR,
    SET_USER_IS_BENEFICIARY,
} from "./types";
import { ContractKit } from "@celo/contractkit";


export function setUserCeloInfo(celoInfo: IUserCeloInfo): UserActionTypes {
    return {
        type: SET_USER_CELO_INFO,
        payload: celoInfo,
    }
}

export function setUserWalletBalance(balance: string): UserActionTypes {
    return {
        type: SET_USER_WALLET_BALANCE,
        payload: balance,
    }
}

export function setUserIsBeneficiary(isBeneficiary: boolean): UserActionTypes {
    return {
        type: SET_USER_IS_BENEFICIARY,
        payload: isBeneficiary,
    }
}

export function setUserIsCommunityManager(isCommunityManager: boolean): UserActionTypes {
    return {
        type: SET_USER_IS_COMMUNITY_COORDINATOR,
        payload: isCommunityManager,
    }
}

export function setUserFirstTime(firstTime: boolean): UserActionTypes {
    return {
        type: SET_USER_FIRST_TIME,
        payload: firstTime,
    }
}

export function setCeloKit(kit: ContractKit): NetworkActionTypes {
    return {
        type: SET_CELO_KIT,
        payload: kit,
    }
}

export function setImpactMarketContract(impactMarket: any): NetworkActionTypes {
    return {
        type: SET_IMPACTMARKET_CONTRACT,
        payload: impactMarket,
    }
}

export function setCommunityContract(community: any): NetworkActionTypes {
    return {
        type: SET_COMMUNITY_CONTRACT,
        payload: community,
    }
}