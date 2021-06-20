import combinedReducer from 'helpers/redux/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { createStore } from 'redux';

import Donate from '../index';

const store = createStore(combinedReducer);

const mockedCommunityAttributes = {
    id: 2,
    publicId: '5',
    requestByAddress: '',
    contractAddress: '',
    name: 'Communuity Test',
    description: 'Communuity Test',
    descriptionEn: null,
    language: 'en',
    currency: 'USD',
    city: 'Lisbon',
    country: 'Portugal',
    gps: {
        latitude: 123,
        longitude: 123,
    },
    email: 'teste@teste.com',
    visibility: 'public',
    coverMediaId: 4,
    status: 'valid',
    started: new Date(),

    // timestamps
    createdAt: new Date(),
    updatedAt: new Date(),
};

const tree = create(
    <Provider store={store}>
        <Donate community={mockedCommunityAttributes} />
    </Provider>
).toJSON();

describe('CommunityManager screen test', () => {
    test('should render Donate correctly', () => {
        expect(tree).toMatchSnapshot();
    });
});
