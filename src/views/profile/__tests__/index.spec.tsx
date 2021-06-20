import combinedReducer from 'helpers/redux/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { createStore } from 'redux';

import ProfileScreen from '../index';

const store = createStore(combinedReducer);

const tree = create(
    <Provider store={store}>
        <ProfileScreen />
    </Provider>
).toJSON();

test('should render ProfileScreen correctly', () => {
    expect(tree).toMatchSnapshot();
});
