import { IRootState } from 'helpers/types/state';
import { combineReducers } from 'redux';

import { appReducer } from './app';
import { authReducer } from './auth';
import { modalDonateReducer } from './modalDonate';
import { storiesReducer } from './stories';
import { userReducer } from './user';

export default combineReducers<IRootState>({
    user: userReducer,
    auth: authReducer,
    app: appReducer,
    modalDonate: modalDonateReducer,
    stories: storiesReducer,
});
