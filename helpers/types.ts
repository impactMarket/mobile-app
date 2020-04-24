import { ContractKit } from "@celo/contractkit";

export const STORAGE_USER_ADDRESS = '@celoinfo:address'
export const STORAGE_USER_PHONE_NUMBER = '@celoinfo:phonenumber'
export const STORAGE_USER_FIRST_TIME = '@status:firstime'
export const SET_USER_CELO_INFO = 'SET_USER_CELO_INFO';
export const SET_USER_WALLET_BALANCE = 'SET_USER_WALLET_BALANCE';
export const SET_USER_FIRST_TIME = 'SET_USER_FIRST_TIME';
export const SET_CELO_KIT = 'SET_CELO_KIT';
export const SET_COMMUNITY_CONTRACT = 'SET_COMMUNITY_CONTRACT';
export const SET_IMPACTMARKET_CONTRACT = 'SET_IMPACTMARKET_CONTRACT';

// state
export interface IUserCeloInfo {
    // verify if address is undefined to determine if user is logged in
    address: string;
    phoneNumber: string;
    balance: string;
}

export interface IUserState {
    celoInfo: IUserCeloInfo,
    firstTime: boolean;
}

export interface IContractsState {
    impactMarketContract: any,
    communityContract: any
}

export interface INetworkState {
    kit: ContractKit,
    contracts: IContractsState,
}

export interface IRootState {
    user: IUserState,
    network: INetworkState,
}

// action
interface UserCeloInfoAction {
    type: typeof SET_USER_CELO_INFO
    payload: IUserCeloInfo
}

interface UserSetBalanceAction {
    type: typeof SET_USER_WALLET_BALANCE
    payload: string
}

interface UserSetFirstTimeAction {
    type: typeof SET_USER_FIRST_TIME
    payload: boolean
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

export type UserActionTypes = UserCeloInfoAction | UserSetBalanceAction | UserSetFirstTimeAction
export type NetworkActionTypes = CeloKitAction | ImpactMarketAction | CommunityAction

export interface ILoginCallbackAnswer {
    celoInfo: IUserCeloInfo;
}

export interface ICommunityInfo {
    title: string;
    location: string;
    image: string;
    backers: number;
    beneficiaries: number;
    ubiRate: number;
    totalClaimed: number;
    totalRaised: number;
}