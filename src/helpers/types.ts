import { ContractKit } from '@celo/contractkit';

export const STORAGE_USER_ADDRESS = '@celoinfo:address';
export const STORAGE_USER_PHONE_NUMBER = '@celoinfo:phonenumber';
export const STORAGE_USER_FIRST_TIME = '@status:firstime';
export const STORAGE_USER_AUTH_TOKEN = '@user:authtoken';
export const INIT_USER = 'INIT_USER';
export const SET_USER_CELO_INFO = 'SET_USER_CELO_INFO';
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_USER_EXCHANGE_RATE = 'SET_USER_EXCHANGE_RATE';
export const SET_USER_WALLET_BALANCE = 'SET_USER_WALLET_BALANCE';
export const SET_CELO_KIT = 'SET_CELO_KIT';
export const SET_COMMUNITY_CONTRACT = 'SET_COMMUNITY_CONTRACT';
export const SET_COMMUNITY = 'SET_COMMUNITY';
export const SET_USER_IS_BENEFICIARY = 'SET_USER_IS_BENEFICIARY';
export const SET_USER_IS_COMMUNITY_MANAGER = 'SET_USER_IS_COMMUNITY_MANAGER';
export const RESET_USER_APP = 'RESET_USER_APP';
export const RESET_NETWORK_APP = 'RESET_NETWORK_APP';
export const SET_PUSH_NOTIFICATION_TOKEN = 'SET_PUSH_NOTIFICATION_TOKEN';
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_APP_PYMENT_TO_ACTION = 'SET_APP_PYMENT_TO_ACTION';
export const SET_USER_LANGUAGE = 'SET_USER_LANGUAGE';
export const SET_EXCHANGE_RATES = 'SET_EXCHANGE_RATES';
export const CONSENT_ANALYTICS = 'CONSENT_ANALYTICS';

// state
export interface IUserCeloInfo {
    // verify if address is undefined to determine if user is logged in
    address: string;
    phoneNumber: string;
    balance: string;
}

// TODO: same as IUser. Rmove one.
export interface IUserInfo {
    name: string;
    currency: string;
    exchangeRate: number;
    avatar: string;
    language: string;
}

export interface IUserCommunityInfo {
    isBeneficiary: boolean;
    isManager: boolean;
}

export interface IUserState {
    celoInfo: IUserCeloInfo;
    user: IUserInfo;
    community: IUserCommunityInfo;
}

export interface IContractsState {
    communityContract: any;
}

export interface INetworkState {
    community: ICommunityInfo;
    contracts: IContractsState;
}

export interface IAuthState {
    pushNotificationsToken: string;
    authToken: string;
}

export interface IAppState {
    kit: ContractKit;
    exchangeRates: any;
    paymentToAddress: string;
}

// same as ICombinedState
export interface IRootState {
    user: IUserState;
    network: INetworkState;
    auth: IAuthState;
    app: IAppState;
}

// action
interface UserCeloInfoAction {
    type: typeof SET_USER_CELO_INFO;
    payload: IUserCeloInfo;
}

interface UserInfoAction {
    type: typeof SET_USER_INFO;
    payload: IUserInfo;
}

interface UserExchangeRateAction {
    type: typeof SET_USER_EXCHANGE_RATE;
    payload: number;
}

interface InitUserAction {
    type: typeof INIT_USER;
    payload: IInitUser;
}

interface UserSetBalanceAction {
    type: typeof SET_USER_WALLET_BALANCE;
    payload: string;
}

interface UserSetIsBeneficiaryAction {
    type: typeof SET_USER_IS_BENEFICIARY;
    payload: boolean;
}

interface UserSetIsCommunityManagerAction {
    type: typeof SET_USER_IS_COMMUNITY_MANAGER;
    payload: boolean;
}

interface CeloKitAction {
    type: typeof SET_CELO_KIT;
    payload: ContractKit;
}

interface SetCommunityContractAction {
    type: typeof SET_COMMUNITY_CONTRACT;
    payload: any;
}

interface SetCommunityAction {
    type: typeof SET_COMMUNITY;
    payload: ICommunityInfo;
}

interface ResetUserAction {
    type: typeof RESET_USER_APP;
    payload: any;
}

interface ResetNetworkAction {
    type: typeof RESET_NETWORK_APP;
    payload: any;
}

interface SetTokenPushNotificationsAction {
    type: typeof SET_PUSH_NOTIFICATION_TOKEN;
    payload: string;
}

interface SetAuthTokenAction {
    type: typeof SET_AUTH_TOKEN;
    payload: string;
}
interface UserLanguageAction {
    type: typeof SET_USER_LANGUAGE;
    payload: string;
}

interface SetAppPaymentToAction {
    type: typeof SET_APP_PYMENT_TO_ACTION;
    payload: string;
}

interface SetAppEchangeRatesAction {
    type: typeof SET_EXCHANGE_RATES;
    payload: any;
}

export type UserActionTypes =
    | UserCeloInfoAction
    | UserSetBalanceAction
    | UserSetIsBeneficiaryAction
    | UserSetIsCommunityManagerAction
    | ResetUserAction
    | UserInfoAction
    | UserLanguageAction
    | UserExchangeRateAction
    | InitUserAction;
export type NetworkActionTypes =
    | SetCommunityContractAction
    | SetCommunityAction
    | ResetNetworkAction;
export type AuthActionTypes =
    | SetTokenPushNotificationsAction
    | SetAuthTokenAction;
export type AppActionTypes =
    | CeloKitAction
    | SetAppPaymentToAction
    | SetAppEchangeRatesAction;

export interface IStoreCombinedState {
    user: IUserState;
    network: INetworkState;
    auth: IAuthState;
    app: IAppState;
}

export type IStoreCombinedActionsTypes =
    | UserActionTypes
    | NetworkActionTypes
    | AuthActionTypes
    | AppActionTypes;

export interface ITransaction {
    tx: string;
    from: string;
    contractAddress: string;
    event: string;
    values: any;
}

export interface ITabBarIconProps {
    focused: boolean;
    color: string;
    size: number;
}

// **API and app**

export interface ICommunity {
    publicId: string;
    requestByAddress: string;
    contractAddress: string;
    name: string;
    description: string;
    descriptionEn: string;
    language: string;
    currency: string;
    country: string;
    city: string;
    gps: {
        latitude: number;
        longitude: number;
    };
    visibility: string;
    email: string;
    coverImage: string;
    status: string;
    txCreationObj: ICommunityVars;
    createdAt: string;
    updatedAt: string;
}

export interface ICommunityInfo extends ICommunity {
    backers: string[];
    beneficiaries: {
        added: ICommunityInfoBeneficiary[];
        removed: ICommunityInfoBeneficiary[];
    };
    managers: string[];
    ssi: {
        dates: Date[];
        values: number[];
    };
    totalClaimed: string;
    totalRaised: string;
    vars: ICommunityVars;
}

export interface ICommunityVars {
    _claimAmount: string;
    _baseInterval: string;
    _incrementInterval: string;
    _maxClaim: string;
}

export interface ICommunityInfoBeneficiary {
    address: string;
    name: string;
    timestamp: number;
    claimed: string;
}

export interface IUser {
    address: string;
    username: string | null;
    currency: string;
    avatar: string;
    language: string;
}

export interface IUserWelcome {
    user: IUser; // TODO: remove in the future, as it's intended to be on memory
    exchangeRates: any; // TODO: this is not really an any
    isBeneficiary: boolean;
    isManager: boolean;
    community?: ICommunityInfo;
}

export interface IInitUser {
    user: IUser & IUserCeloInfo;
    exchangeRates: any;
    isBeneficiary: boolean;
    isManager: boolean;
    community?: ICommunityInfo;
}

export interface IUserWelcomeAuth extends IUserWelcome {
    token: string;
}

export interface IAddressAndName {
    address: string;
    name: string;
}

export interface IUserTxAPI {
    picture: string;
    counterParty: IAddressAndName;
    value: string;
    timestamp: number;
    fromUser: boolean;
}

/**
 * @deprecated
 */
export interface IRecentTxAPI {
    picture: string;
    from: IAddressAndName;
    value: string;
    timestamp: number;
}

/**
 * @deprecated
 */
export interface IPaymentsTxAPI {
    picture: string;
    to: IAddressAndName;
    value: string;
    timestamp: number;
}
