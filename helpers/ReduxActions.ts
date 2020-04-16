import { IUserCeloInfo, SET_USER_CELO_INFO, UserActionTypes, SET_CELO_KIT, SET_COMMUNITY_CONTRACT, SET_IMPACTMARKET_CONTRACT } from "./types";
import { ContractKit } from "@celo/contractkit";

export function setUserCeloInfo(celoInfo: IUserCeloInfo): UserActionTypes {
    return {
        type: SET_USER_CELO_INFO,
        payload: celoInfo,
    }
}

export function setCeloKit(kit: ContractKit): UserActionTypes {
    return {
        type: SET_CELO_KIT,
        payload: kit,
    }
}

export function setImpactMarketContract(impactMarket: any): UserActionTypes {
    return {
        type: SET_IMPACTMARKET_CONTRACT,
        payload: impactMarket,
    }
}

export function setCommunityContract(community: any): UserActionTypes {
    return {
        type: SET_COMMUNITY_CONTRACT,
        payload: community,
    }
}