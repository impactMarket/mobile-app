import { combineReducers } from 'redux';

const INITIAL_STATE = {
    account: '',
    phoneNumber: '',
};

const userReducer = (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case 'SET_USER_ADDRESS':
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time
            let {
                account,
                phoneNumber,
            } = state;

            account = action.payload;

            // Finally, update our redux state
            const newState = { account, phoneNumber };
            return newState;
        default:
            return state
    }
};

export default combineReducers({
    users: userReducer,
});