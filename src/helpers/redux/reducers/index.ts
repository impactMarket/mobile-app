import { combineReducers } from 'redux';

import { appReducer } from './app';
import { authReducer } from './auth';
import { userReducer } from './user';
import { storiesReducer } from './stories';
import { modalDonateReducer } from './modalDonate';
import { IRootState } from 'helpers/types/state';

export default combineReducers<IRootState>({
    user: userReducer,
    auth: authReducer,
    app: appReducer,
    modalDonate: modalDonateReducer,
    stories: storiesReducer,
});
