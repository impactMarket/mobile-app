import combinedReducer from 'helpers/redux/reducers';
import { createStore } from 'redux';

export function buildStore(initialState: object = {}) {
    const store = createStore(combinedReducer, initialState);

    return store;
}
