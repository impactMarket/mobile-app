import { appReducer } from 'helpers/redux/reducers/app';
import { authReducer } from 'helpers/redux/reducers/auth';
import { modalDonateReducer } from 'helpers/redux/reducers/modalDonate';
import { storiesReducer } from 'helpers/redux/reducers/stories';
import { userReducer } from 'helpers/redux/reducers/user';
import { combineReducers, createStore } from 'redux';

export function createTestStore() {
    const store = createStore(
        combineReducers({
            user: userReducer,
            auth: authReducer,
            app: appReducer,
            modalDonate: modalDonateReducer,
            stories: storiesReducer,
        })
    );
    return store;
}
