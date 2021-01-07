import { combineReducers } from 'redux';
import { appReducer } from './app';
import { authReducer } from './auth';
import { userReducer } from './user';
import { modalDonateReducer, viewReducer } from './view';

export default combineReducers({
    user: userReducer,
    auth: authReducer,
    view: viewReducer,
    app: appReducer,
    modalDonate: modalDonateReducer
});
