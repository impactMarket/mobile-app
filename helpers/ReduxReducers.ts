import { combineReducers } from 'redux';
import {
    IRootState,
    UserActionTypes,
    SET_USER_CELO_INFO,
    SET_CELO_KIT,
    SET_COMMUNITY_CONTRACT,
    SET_IMPACTMARKET_CONTRACT,
    IUserState,
    INetworkState,
    NetworkActionTypes,
} from './types';


const INITIAL_STATE_USER: IUserState = {
    celoInfo: {
        address: '',
        phoneNumber: '',
    }
};

const INITIAL_NETWORK_USER: INetworkState = {
    kit: undefined as any,
    contracts: {
        communityContract: undefined as any,
        impactMarketContract: undefined as any,
    }
}

const userReducer = (state = INITIAL_STATE_USER, action: UserActionTypes) => {
    switch (action.type) {
        case SET_USER_CELO_INFO:
            return { ...state, celoInfo: action.payload };
        default:
            return state
    }
};

const networkReducer = (state = INITIAL_NETWORK_USER, action: NetworkActionTypes) => {
    let contracts;
    let user;
    switch (action.type) {
        case SET_CELO_KIT:
            return { ...state, kit: action.payload };
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

export default combineReducers({
    user: userReducer,
    network: networkReducer,
})

