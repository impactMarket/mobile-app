import { IRootState } from 'helpers/types/state';
import { combineReducers } from 'redux';
import { reducer as offline } from 'redux-offline-queue';

import { appReducer } from './app';
import { authReducer } from './auth';
import { communitiesReducer } from './communities';
import { modalDonateReducer } from './modalDonate';
import { storiesReducer } from './stories';
import { userReducer } from './user';

export default combineReducers<IRootState>({
    offline,
    user: userReducer,
    auth: authReducer,
    app: appReducer,
    modalDonate: modalDonateReducer,
    stories: storiesReducer,
    communities: communitiesReducer,
});
