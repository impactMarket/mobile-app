import { combineReducers } from 'redux';
import { SET_USER_CELO_INFO, IReduxState, UserActionTypes, SET_CELO_KIT } from './types';

const INITIAL_STATE: IReduxState = {
    celoInfo: {
        address: '',
        phoneNumber: '',
    },
    kit: undefined as any,
};

const userReducer = (state = INITIAL_STATE, action: UserActionTypes) => {
    switch (action.type) {
        case SET_USER_CELO_INFO:
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time

            // Finally, update our redux state
            return { ...state, celoInfo: action.payload };
        case SET_CELO_KIT:
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time

            // Finally, update our redux state
            return { ...state, kit: action.payload };
        default:
            return state
    }
};

export default combineReducers({
    users: userReducer,
})

