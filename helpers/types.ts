import { ContractKit } from "@celo/contractkit";
import { ethers } from "ethers";
import { ImpactMarketInstance, CommunityInstance } from "../contracts/types/truffle-contracts";

export const STORAGE_USER_ADDRESS = '@celoinfo:address'
export const STORAGE_USER_PHONE_NUMBER = '@celoinfo:phonenumber'
export const SET_USER_CELO_INFO = 'SET_USER_CELO_INFO';
export const SET_CELO_KIT = 'SET_CELO_KIT';
export const SET_COMMUNITY_CONTRACT = 'SET_COMMUNITY_CONTRACT';
export const SET_IMPACTMARKET_CONTRACT = 'SET_IMPACTMARKET_CONTRACT';

// state
export interface IUserCeloInfo {
    address: string;
    phoneNumber: string;
}

export interface IUserState {
    celoInfo: IUserCeloInfo,
}

export interface IContractsState {
    impactMarketContract: ethers.Contract & ImpactMarketInstance,
    communityContract: ethers.Contract & CommunityInstance
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
    payload: ethers.Contract & ImpactMarketInstance;
}

interface CommunityAction {
    type: typeof SET_COMMUNITY_CONTRACT
    payload: ethers.Contract & CommunityInstance;
}

export type UserActionTypes = ISetUserCeloInfoAction | CeloKitAction | ImpactMarketAction | CommunityAction
