import { ContractKit } from "@celo/contractkit";

export const STORAGE_USER_ADDRESS = '@celoinfo:address'
export const STORAGE_USER_PHONE_NUMBER = '@celoinfo:phonenumber'
export const STORAGE_USER_FIRST_TIME = '@status:firstime'
export const SET_USER_CELO_INFO = 'SET_USER_CELO_INFO';
export const SET_USER_WALLET_BALANCE = 'SET_USER_WALLET_BALANCE';
export const SET_CELO_KIT = 'SET_CELO_KIT';
export const SET_COMMUNITY_CONTRACT = 'SET_COMMUNITY_CONTRACT';
export const SET_IMPACTMARKET_CONTRACT = 'SET_IMPACTMARKET_CONTRACT';
export const SET_USER_IS_BENEFICIARY = 'SET_USER_IS_BENEFICIARY';
export const SET_USER_IS_COMMUNITY_COORDINATOR = 'SET_USER_IS_COMMUNITY_COORDINATOR';
export const RESET_USER_APP = 'RESET_USER_APP';
export const RESET_NETWORK_APP = 'RESET_NETWORK_APP';

// state
export interface IUserCeloInfo {
    // verify if address is undefined to determine if user is logged in
    address: string;
    phoneNumber: string;
    balance: string;
}

export interface IUserCommunityInfo {
    isBeneficiary: boolean;
    isCoordinator: boolean;
}

export interface IUserState {
    celoInfo: IUserCeloInfo,
    community: IUserCommunityInfo,
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

interface UserSetIsBeneficiaryAction {
    type: typeof SET_USER_IS_BENEFICIARY
    payload: boolean
}

interface UserSetIsCommunityManagerAction {
    type: typeof SET_USER_IS_COMMUNITY_COORDINATOR
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

interface ResetUserAction {
    type: typeof RESET_USER_APP
    payload: any;
}

interface ResetNetworkAction {
    type: typeof RESET_NETWORK_APP
    payload: any;
}

export type UserActionTypes = UserCeloInfoAction | UserSetBalanceAction | UserSetIsBeneficiaryAction | UserSetIsCommunityManagerAction | ResetUserAction
export type NetworkActionTypes = CeloKitAction | ImpactMarketAction | CommunityAction | ResetNetworkAction

export interface ILoginCallbackAnswer {
    celoInfo: IUserCeloInfo;
}

export interface ITransaction {
    tx: string; // Note that the `null assertion` `!` is required in strict mode.
    from: string;
    contractAddress: string;
    event: string;
    values: any;
}

export interface ICommunity {
    publicId: string;
    requestByAddress: string;
    contractAddress: string;
    name: string;
    description: string;
    location: {
        title: string;
        latitude: number;
        longitude: number;
    };
    coverImage: string;
    status: string;
    txCreationObj: any;
    createdAt: string;
    updatedAt: string;
}

export interface ICommunityInfo extends ICommunity {
    backers: string[];
    beneficiaries: {
        added: string[];
        removed: string[];
    };
    managers: string[];
    totalClaimed: string;
    totalRaised: string;
    vars: ICommunityVars;
}

export interface ICommunityVars {
    _amountByClaim: string;
    _baseIntervalTime: string;
    _incIntervalTime: string;
    _claimHardCap: string;
}

export interface IBeneficiary {
    walletAddress: string;
    communityPublicId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IRecentTxListItem {
    from: string;
    txs: number;
    timestamp: number;
}

export interface IRecentPaymentsListItem {
    to: string;
    value: string;
    timestamp: number;
}