import { combineReducers } from 'redux';

import { appReducer } from './app';
import { authReducer } from './auth';
import { userReducer } from './user';
import { modalDonateReducer } from './view';

export default combineReducers({
    user: userReducer,
    auth: authReducer,
    app: appReducer,
    modalDonate: modalDonateReducer,
});
