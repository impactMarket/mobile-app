import { combineReducers } from 'redux';
import { SET_USER_CELO_INFO, IRootState, UserActionTypes, SET_CELO_KIT, SET_COMMUNITY_CONTRACT, SET_IMPACTMARKET_CONTRACT } from './types';

const INITIAL_STATE: IRootState = {
    user: {
        celoInfo: {
            address: '',
            phoneNumber: '',
        },
    },
    kit: undefined as any,
    contracts: {
        communityContract: undefined as any,
        impactMarketContract: undefined as any,
    }
};

const userReducer = (state = INITIAL_STATE, action: UserActionTypes) => {
    let contracts;
    let user;
    switch (action.type) {
        case SET_USER_CELO_INFO:
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time
            user = state.user;
            user.celoInfo = action.payload;
            // Finally, update our redux state
            return { ...state, user };
        case SET_CELO_KIT:
            return { ...state, kit: action.payload };
        case SET_COMMUNITY_CONTRACT:
            contracts = state.contracts;
            contracts.communityContract = action.payload;
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
    users: userReducer,
})

