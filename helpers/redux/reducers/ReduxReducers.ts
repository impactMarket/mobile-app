import { combineReducers } from 'redux';
import {
    UserActionTypes,
    SET_USER_CELO_INFO,
    SET_CELO_KIT,
    SET_COMMUNITY_CONTRACT,
    SET_IMPACTMARKET_CONTRACT,
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
    },
    community: {
        isBeneficiary: false,
        isManager: false,
    },
};

const INITIAL_STATE_NETWORK: INetworkState = {
    kit: undefined as any,
    // TODO: save community object from database with contract inside
    community: undefined as any,
    contracts: {
        communityContract: undefined as any,
        impactMarketContract: undefined as any,
    }
}

const INITIAL_STATE_AUTH: IAuthState = {
    pushNotificationsToken: '',
}

const userReducer = (state = INITIAL_STATE_USER, action: UserActionTypes) => {
    const community = state.community;
    switch (action.type) {
        case RESET_USER_APP:
            // DO NOT RETURN INITIAL_STATE_USER
            return {
                celoInfo: {
                    address: '',
                    phoneNumber: '',
                    balance: '0',
                },
                user: {
                    name: '',
                    currency: 'USD',
                    exchangeRate: 1,
                },
                community: {
                    isBeneficiary: false,
                    isManager: false,
                },
            };
        case SET_USER_CELO_INFO:
            return { ...state, celoInfo: action.payload };
        case SET_USER_INFO:
            return { ...state, user: action.payload };
        case SET_USER_WALLET_BALANCE:
            const celoInfo = state.celoInfo;
            celoInfo.balance = action.payload;
            return { ...state, celoInfo };
        case SET_USER_IS_BENEFICIARY:
            community.isBeneficiary = action.payload
            return { ...state, community };
        case SET_USER_IS_COMMUNITY_MANAGER:
            community.isManager = action.payload
            return { ...state, community };
        default:
            return state
    }
};

const networkReducer = (state = INITIAL_STATE_NETWORK, action: NetworkActionTypes) => {
    let contracts;
    switch (action.type) {
        case RESET_NETWORK_APP:
            // ERASE ONLY THE CONTRACTS
            return {
                ...state,
                contracts: {
                    communityContract: undefined,
                    impactMarketContract: undefined
                }
            };
        case SET_CELO_KIT:
            return { ...state, kit: action.payload };
        case SET_COMMUNITY:
            return { ...state, community: action.payload };
        case SET_COMMUNITY_CONTRACT:
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time
            contracts = state.contracts;
            contracts.communityContract = action.payload;
            // Finally, update our redux state
            return { ...state, kit: action.payload };
        case SET_IMPACTMARKET_CONTRACT:
            contracts = state.contracts;
            contracts.impactMarketContract = action.payload;
            return { ...state, kit: action.payload };
        default:
            return state
    }
};

const authReducer = (state = INITIAL_STATE_AUTH, action: AuthActionTypes) => {
    switch (action.type) {
        case SET_PUSH_NOTIFICATION_TOKEN:
            return { ...state, pushNotificationsToken: action.payload };
        default:
            return state
    }
};

export default combineReducers({
    user: userReducer,
    network: networkReducer,
    auth: authReducer,
})

