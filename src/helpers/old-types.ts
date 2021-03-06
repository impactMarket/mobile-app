// import { ContractKit } from '@celo/contractkit';

// state
// export interface IUserCeloInfo {
//     // verify if address is undefined to determine if user is logged in
//     address: string;
//     phoneNumber: string;
//     balance: string;
// }

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

// export interface IUserState {
//     celoInfo: IUserCeloInfo;
//     user: IUserInfo;
//     community: IUserCommunityInfo;
// }

// export interface IContractsState {
//     communityContract: any;
// }

// export interface INetworkState {
//     community: ICommunityInfo;
//     contracts: IContractsState;
// }

// export interface IAuthState {
//     pushNotificationToken: string;
//     authToken: string;
// }

// export interface IAppState {
//     kit: ContractKit;
//     exchangeRates: any;
//     paymentToAddress: string;
//     suspectWrongDateTime: boolean;
//     timeDiff: number;
//     fromWelcomeScreen: string;
// }

// // same as ICombinedState
// export interface IRootState {
//     user: IUserState;
//     network: INetworkState;
//     auth: IAuthState;
//     app: IAppState;
// }

// // action
// interface UserWalletAction {
//     type: typeof SET_USER_CELO_INFO;
//     payload: IUserCeloInfo;
// }

// interface UserMetadataAction {
//     type: typeof SET_USER_INFO;
//     payload: IUserInfo;
// }

// interface UserExchangeRateAction {
//     type: typeof SET_USER_EXCHANGE_RATE;
//     payload: number;
// }

// interface InitUserAction {
//     type: typeof INIT_USER;
//     payload: IInitUser;
// }

// interface UserSetBalanceAction {
//     type: typeof SET_USER_WALLET_BALANCE;
//     payload: string;
// }

// interface UserSetIsBeneficiaryAction {
//     type: typeof SET_USER_IS_BENEFICIARY;
//     payload: boolean;
// }

// interface UserSetIsCommunityManagerAction {
//     type: typeof SET_USER_IS_COMMUNITY_MANAGER;
//     payload: boolean;
// }

// interface CeloKitAction {
//     type: typeof SET_CELO_KIT;
//     payload: ContractKit;
// }

// interface SetCommunityContractAction {
//     type: typeof SET_COMMUNITY_CONTRACT;
//     payload: any;
// }

// interface SetCommunityAction {
//     type: typeof SET_COMMUNITY;
//     payload: ICommunityInfo;
// }

// interface ResetUserAction {
//     type: typeof RESET_USER_APP;
//     payload: any;
// }

// interface ResetNetworkAction {
//     type: typeof RESET_NETWORK_APP;
//     payload: any;
// }

// interface SetTokenPushNotificationsAction {
//     type: typeof SET_PUSH_NOTIFICATION_TOKEN;
//     payload: string;
// }

// interface SetAuthTokenAction {
//     type: typeof SET_AUTH_TOKEN;
//     payload: string;
// }
// interface UserLanguageAction {
//     type: typeof SET_USER_LANGUAGE;
//     payload: string;
// }

// interface SetAppSuspectWrongDateTime {
//     type: typeof SET_APP_SUSPECT_WRONG_DATETIME;
//     payload: {
//         suspect: boolean;
//         timeDiff: number;
//     };
// }
// interface SetAppFromWelcomeScreen {
//     type: typeof SET_APP_FROM_WELCOME_SCREEN;
//     payload: string;
// }

// interface SetAppEchangeRatesAction {
//     type: typeof SET_EXCHANGE_RATES;
//     payload: any;
// }

// export type UserActionTypes =
//     | UserWalletAction
//     | UserSetBalanceAction
//     | UserSetIsBeneficiaryAction
//     | UserSetIsCommunityManagerAction
//     | ResetUserAction
//     | UserMetadataAction
//     | UserLanguageAction
//     | UserExchangeRateAction
//     | InitUserAction;
// export type NetworkActionTypes =
//     | SetCommunityContractAction
//     | SetCommunityAction
//     | ResetNetworkAction;
// export type AuthActionTypes =
//     | SetTokenPushNotificationsAction
//     | SetAuthTokenAction;
// export type AppActionTypes =
//     | CeloKitAction
//     | SetAppEchangeRatesAction
//     | SetAppSuspectWrongDateTime
//     | SetAppFromWelcomeScreen;

// export interface IRootState {
//     user: IUserState;
//     network: INetworkState;
//     auth: IAuthState;
//     app: IAppState;
// }

// export type IStoreCombinedActionsTypes =
//     | UserActionTypes
//     | NetworkActionTypes
//     | AuthActionTypes
//     | AppActionTypes;

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

// export interface ICommunity {
//     publicId: string;
//     requestByAddress: string;
//     contractAddress: string;
//     name: string;
//     description: string;
//     descriptionEn: string;
//     language: string;
//     currency: string;
//     country: string;
//     city: string;
//     gps: {
//         latitude: number;
//         longitude: number;
//     };
//     visibility: string;
//     email: string;
//     coverImage: string;
//     status: string;
// }

// export interface ICommunityState {
//     claimed: string;
//     raised: string;
//     beneficiaries: number;
//     backers: number;
// }

// export interface ICommunityMetrics {
//     ssiDayAlone: number;
//     ssi: number;
//     ubiRate: number;
//     estimatedDuration: number;
//     historicalSSI: number[];
// }

// export interface ICommunityInfo extends ICommunity {
//     /**
//      * @deprecated
//      */
//     backers: string[];
//     beneficiaries: {
//         added: ICommunityInfoBeneficiary[];
//         removed: ICommunityInfoBeneficiary[];
//     };
//     managers: string[];
//     /**
//      * @deprecated
//      */
//     ssi: {
//         dates: Date[];
//         values: number[];
//     };
//     state: ICommunityState;
//     metrics?: ICommunityMetrics;
//     contractParams: ICommunityContractParams;
// }

// export interface ICommunityContractParams {
//     claimAmount: string;
//     maxClaim: string;
//     baseInterval: number;
//     incrementInterval: number;
// }

// export interface ICommunityInfoBeneficiary {
//     address: string;
//     name: string;
//     timestamp: number;
//     claimed: string;
// }

// export interface IUser {
//     address: string;
//     username: string | null;
//     currency: string;
//     avatar: string;
//     language: string;
// }

// export interface IUserWelcome {
//     user: IUser; // TODO: remove in the future, as it's intended to be on memory
//     exchangeRates: any; // TODO: this is not really an any
//     isBeneficiary: boolean;
//     isManager: boolean;
//     community?: ICommunity;
// }

// export interface IInitUser {
//     user: IUser & IUserCeloInfo;
//     exchangeRates: any;
//     isBeneficiary: boolean;
//     isManager: boolean;
//     community?: ICommunityInfo;
// }

// export interface IUserWelcomeAuth extends IUserWelcome {
//     token: string;
// }

export interface IAddressAndName {
    address: string;
    name: string;
}

/**
 * @deprecated
 */
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
