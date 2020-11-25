import { combineReducers } from 'redux';

import {
    UserActionTypes,
    SET_USER_CELO_INFO,
    SET_CELO_KIT,
    SET_COMMUNITY_CONTRACT,
    IUserState,
    INetworkState,
    NetworkActionTypes,
    SET_USER_WALLET_BALANCE,
    SET_USER_IS_BENEFICIARY,
    SET_USER_IS_COMMUNITY_MANAGER,
    RESET_USER_APP,
    RESET_NETWORK_APP,
    SET_USER_INFO,
    SET_COMMUNITY,
    IAuthState,
    AuthActionTypes,
    SET_PUSH_NOTIFICATION_TOKEN,
    SET_AUTH_TOKEN,
    SET_USER_EXCHANGE_RATE,
    IAppState,
    AppActionTypes,
    SET_USER_LANGUAGE,
    INIT_USER,
    SET_EXCHANGE_RATES,
    SET_APP_SUSPECT_WRONG_DATETIME,
} from '../../types';

const INITIAL_STATE_USER: IUserState = {
    celoInfo: {
        address: '',
        phoneNumber: '',
        balance: '0',
    },
    user: {
        name: '',
        currency: 'USD',
        exchangeRate: 1,
        avatar: '1',
        language: 'en',
    },
    community: {
        isBeneficiary: false,
        isManager: false,
    },
};

const INITIAL_STATE_NETWORK: INetworkState = {
    // TODO: save community object from database with contract inside
    community: undefined as any,
    contracts: {
        communityContract: undefined as any,
    },
};

const INITIAL_STATE_AUTH: IAuthState = {
    pushNotificationsToken: '',
    authToken: '',
};

const INITIAL_STATE_APP: IAppState = {
    // TODO: save exhangeRates on load
    kit: undefined as any,
    exchangeRates: undefined as any,
    paymentToAddress: '',
    suspectWrongDateTime: false,
    timeDiff: 0,
};

const userReducer = (
    state = INITIAL_STATE_USER,
    action: UserActionTypes
): IUserState => {
    const community = state.community;
    const user = state.user;
    switch (action.type) {
        case INIT_USER:
            return {
                celoInfo: {
                    address: action.payload.user.address,
                    phoneNumber: action.payload.user.phoneNumber,
                    balance: action.payload.user.balance,
                },
                user: {
                    name:
                        action.payload.user.username === null
                            ? ''
                            : action.payload.user.username,
                    currency: action.payload.user.currency,
                    language: action.payload.user.language,
                    avatar: action.payload.user.avatar,
                    exchangeRate:
                        action.payload.exchangeRates[
                            action.payload.user.currency.toUpperCase()
                        ].rate,
                },
                community: {
                    isBeneficiary: action.payload.isBeneficiary,
                    isManager: action.payload.isManager,
                },
            };
        case RESET_USER_APP:
            return INITIAL_STATE_USER;
        case SET_USER_CELO_INFO:
            return { ...state, celoInfo: action.payload };
        case SET_USER_INFO:
            return { ...state, user: action.payload };
        case SET_USER_EXCHANGE_RATE:
            user.exchangeRate = action.payload;
            return { ...state, user };
        case SET_USER_WALLET_BALANCE:
            const celoInfo = state.celoInfo;
            celoInfo.balance = action.payload;
            return { ...state, celoInfo };
        case SET_USER_LANGUAGE:
            user.language = action.payload;
            return { ...state, user };
        case SET_USER_IS_BENEFICIARY:
            community.isBeneficiary = action.payload;
            return { ...state, community };
        case SET_USER_IS_COMMUNITY_MANAGER:
            community.isManager = action.payload;
            return { ...state, community };
        default:
            return state;
    }
};

const networkReducer = (
    state = INITIAL_STATE_NETWORK,
    action: NetworkActionTypes
) => {
    let contracts;
    switch (action.type) {
        case RESET_NETWORK_APP:
            return INITIAL_STATE_NETWORK;
        case SET_COMMUNITY:
            return { ...state, community: action.payload };
        case SET_COMMUNITY_CONTRACT:
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time
            contracts = state.contracts;
            contracts.communityContract = action.payload;
            // Finally, update our redux state
            return { ...state, contracts };
        default:
            return state;
    }
};

const authReducer = (state = INITIAL_STATE_AUTH, action: AuthActionTypes) => {
    switch (action.type) {
        case SET_PUSH_NOTIFICATION_TOKEN:
            return { ...state, pushNotificationsToken: action.payload };
        case SET_AUTH_TOKEN:
            return { ...state, authToken: action.payload };
        default:
            return state;
    }
};

const appReducer = (state = INITIAL_STATE_APP, action: AppActionTypes) => {
    switch (action.type) {
        case SET_CELO_KIT:
            return { ...state, kit: action.payload };
        case SET_EXCHANGE_RATES:
            return { ...state, exchangeRates: action.payload };
        case SET_APP_SUSPECT_WRONG_DATETIME:
            return {
                ...state,
                suspectWrongDateTime: action.payload.suspect,
                timeDiff: action.payload.timeDiff,
            };
        default:
            return state;
    }
};

export default combineReducers({
    user: userReducer,
    network: networkReducer,
    auth: authReducer,
    app: appReducer,
});
