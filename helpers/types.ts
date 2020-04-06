import { ContractKit } from "@celo/contractkit";

export const STORAGE_USER_ADDRESS = '@celoinfo:address'
export const STORAGE_USER_PHONE_NUMBER = '@celoinfo:phonenumber'
export const SET_USER_CELO_INFO = 'SET_USER_CELO_INFO';
export const SET_CELO_KIT = 'SET_CELO_KIT';

export interface IUserCeloInfo {
    address: string;
    phoneNumber: string;
}

export interface IReduxState {
    celoInfo: IUserCeloInfo,
    kit: ContractKit,
}

interface ISetUserCeloInfoAction {
    type: typeof SET_USER_CELO_INFO
    payload: IUserCeloInfo
}


interface CeloKitAction {
    type: typeof SET_CELO_KIT
    payload: ContractKit;
}

export type UserActionTypes = ISetUserCeloInfoAction | CeloKitAction

export interface IRootState {
    users: IReduxState
}