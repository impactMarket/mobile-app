import combinedReducer from 'helpers/redux/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { createStore } from 'redux';

import CommunityManagerScreen from '../index';

const store = createStore(combinedReducer);

const tree = create(
    <Provider store={store}>
        <CommunityManagerScreen />
    </Provider>
).toJSON();

describe('CommunityManager screen test', () => {
    test('should render CommunityManagerScreen correctly', () => {
        expect(tree).toMatchSnapshot();
    });
});
