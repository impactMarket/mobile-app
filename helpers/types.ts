import { ContractKit } from "@celo/contractkit";

export const STORAGE_USER_ADDRESS = '@celoinfo:address'
export const STORAGE_USER_PHONE_NUMBER = '@celoinfo:phonenumber'
export const SET_USER_CELO_INFO = 'SET_USER_CELO_INFO';
export const SET_CELO_KIT = 'SET_CELO_KIT';
export const SET_COMMUNITY_CONTRACT = 'SET_COMMUNITY_CONTRACT';
export const SET_IMPACTMARKET_CONTRACT = 'SET_IMPACTMARKET_CONTRACT';

// state
export interface IUserCeloInfo {
    // verify if address is undefined to determine if user is logged in
    address: string;
    phoneNumber: string;
}

export interface IUserState {
    celoInfo: IUserCeloInfo,
}

export interface IContractsState {
    impactMarketContract: any,
    communityContract: any
}

export interface IRootState {
    user: IUserState,
    kit: ContractKit,
    contracts: IContractsState,
}

// action
interface ISetUserCeloInfoAction {
    type: typeof SET_USER_CELO_INFO
    payload: IUserCeloInfo
}

interface CeloKitAction {
    type: typeof SET_CELO_KIT
    payload: ContractKit;
}

interface ImpactMarketAction {
    type: typeof SET_IMPACTMARKET_CONTRACT
    payload: any;
}

interface CommunityAction {
    type: typeof SET_COMMUNITY_CONTRACT
    payload: any;
}

export type UserActionTypes = ISetUserCeloInfoAction | CeloKitAction | ImpactMarketAction | CommunityAction
