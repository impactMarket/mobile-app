import combinedReducer from 'helpers/redux/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { createStore } from 'redux';

import CommunityDetailsScreen from '../index';

const store = createStore(combinedReducer);

const routeParams = { communityId: 2, openDonate: true, fromStories: false };

const tree = create(
    <Provider store={store}>
        <CommunityDetailsScreen route={{ params: routeParams }} />
    </Provider>
).toJSON();

describe('CommunityManager screen test', () => {
    test('should render CommunityDetailsScreen correctly', () => {
        expect(tree).toMatchSnapshot();
    });
});
