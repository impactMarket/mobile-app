import combinedReducer from 'helpers/redux/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { createStore } from 'redux';

import Welcome from '../index';

const store = createStore(combinedReducer);

const tree = create(
    <Provider store={store}>
        <Welcome />
    </Provider>
).toJSON();
describe('Welcome screen test', () => {
    test('should render WelcomeScreen correctly', () => {
        expect(tree).toMatchSnapshot();
    });

    test('should render welcomeBtnContainer correctly', () => {
        expect('welcomeBtnContainer').toBeDefined();
    });
});
