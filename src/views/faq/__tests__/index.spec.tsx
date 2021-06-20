import combinedReducer from 'helpers/redux/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { createStore } from 'redux';

import FAQScreen from '../index';

const store = createStore(combinedReducer);

const tree = create(
    <Provider store={store}>
        <FAQScreen />
    </Provider>
).toJSON();

describe('FAQ screen test', () => {
    test('should render FAQScreen correctly', () => {
        expect(tree).toMatchSnapshot();
    });
});
