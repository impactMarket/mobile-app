import combinedReducer from 'helpers/redux/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { createStore } from 'redux';

import CreateCommunityScreen from '../index';

const store = createStore(combinedReducer);

const tree = create(
    <Provider store={store}>
        <CreateCommunityScreen />
    </Provider>
).toJSON();

describe('CreateCommunity screen test', () => {
    test('should render CreateCommunityScreen correctly', () => {
        expect(tree).toMatchSnapshot();
    });
});
