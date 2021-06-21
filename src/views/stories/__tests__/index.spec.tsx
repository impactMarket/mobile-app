import combinedReducer from 'helpers/redux/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { createStore } from 'redux';

import StoriesScreen from '../index';

const store = createStore(combinedReducer);

const tree = create(
    <Provider store={store}>
        <StoriesScreen />
    </Provider>
).toJSON();

describe('Stories screen test', () => {
    test('should render StoriesScreen correctly', () => {
        expect(tree).toMatchSnapshot();
    });
});
