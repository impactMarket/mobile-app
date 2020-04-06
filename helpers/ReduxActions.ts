import { IUserCeloInfo, SET_USER_CELO_INFO, UserActionTypes, SET_CELO_KIT } from "./types";
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