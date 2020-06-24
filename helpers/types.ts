import { ContractKit } from "@celo/contractkit";

export const STORAGE_USER_ADDRESS = '@celoinfo:address'
export const STORAGE_USER_PHONE_NUMBER = '@celoinfo:phonenumber'
export const STORAGE_USER_FIRST_TIME = '@status:firstime'
export const SET_USER_CELO_INFO = 'SET_USER_CELO_INFO';
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_USER_WALLET_BALANCE = 'SET_USER_WALLET_BALANCE';
export const SET_CELO_KIT = 'SET_CELO_KIT';
export const SET_COMMUNITY_CONTRACT = 'SET_COMMUNITY_CONTRACT';
export const SET_COMMUNITY = 'SET_COMMUNITY';
export const SET_IMPACTMARKET_CONTRACT = 'SET_IMPACTMARKET_CONTRACT';
export const SET_USER_IS_BENEFICIARY = 'SET_USER_IS_BENEFICIARY';
export const SET_USER_IS_COMMUNITY_MANAGER = 'SET_USER_IS_COMMUNITY_MANAGER';
export const RESET_USER_APP = 'RESET_USER_APP';
export const RESET_NETWORK_APP = 'RESET_NETWORK_APP';

// state
export interface IUserCeloInfo {
    // verify if address is undefined to determine if user is logged in
    address: string;
    phoneNumber: string;
    balance: string;
}

export interface IUserInfo {
    name: string,
    currency: string,
    exchangeRate: number,
}

export interface IUserCommunityInfo {
    isBeneficiary: boolean;
    isManager: boolean;
}

export interface IUserState {
    celoInfo: IUserCeloInfo,
    user: IUserInfo,
    community: IUserCommunityInfo,
}

export interface IContractsState {
    impactMarketContract: any,
    communityContract: any
}

export interface INetworkState {
    kit: ContractKit,
    community: ICommunityInfo,
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

interface UserInfoAction {
    type: typeof SET_USER_INFO
    payload: IUserInfo
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
    type: typeof SET_USER_IS_COMMUNITY_MANAGER
    payload: boolean
}

interface CeloKitAction {
    type: typeof SET_CELO_KIT
    payload: ContractKit;
}

interface SetImpactMarketContractAction {
    type: typeof SET_IMPACTMARKET_CONTRACT
    payload: any;
}

interface SetCommunityContractAction {
    type: typeof SET_COMMUNITY_CONTRACT
    payload: any;
}

interface SetCommunityAction {
    type: typeof SET_COMMUNITY
    payload: ICommunityInfo;
}

interface ResetUserAction {
    type: typeof RESET_USER_APP
    payload: any;
}

interface ResetNetworkAction {
    type: typeof RESET_NETWORK_APP
    payload: any;
}

export type UserActionTypes = UserCeloInfoAction | UserSetBalanceAction | UserSetIsBeneficiaryAction | UserSetIsCommunityManagerAction | ResetUserAction | UserInfoAction
export type NetworkActionTypes = CeloKitAction | SetImpactMarketContractAction | SetCommunityContractAction | SetCommunityAction | ResetNetworkAction

export interface ITransaction {
    tx: string;
    from: string;
    contractAddress: string;
    event: string;
    values: any;
}

export interface ITabBarIconProps {
    focused: boolean,
    color: string,
    size: number
}

// **API and app**

export interface ICommunity {
    publicId: string;
    requestByAddress: string;
    contractAddress: string;
    name: string;
    description: string;
    city: string;
    country: string;
    location: {
        latitude: number;
        longitude: number;
    };
    email: string;
    visibility: string;
    coverImage: string;
    status: string;
    txCreationObj: any;
    createdAt: string;
    updatedAt: string;
}

export interface ICommunityInfo extends ICommunity {
    backers: string[];
    beneficiaries: {
        added: IAddressAndName[];
        removed: IAddressAndName[];
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

export interface IUser {
    address: string;
    username: string | null;
    currency: string | null;
}

export interface IAddressAndName {
    address: string;
    name: string;
}

export interface IRecentTxAPI {
    from: {
        address: string;
        name: string;
    };
    txs: number;
    timestamp: number;
}

export interface IPaymentsTxAPI {
    to: {
        address: string;
        name: string;
    };
    value: string;
    timestamp: number;
}