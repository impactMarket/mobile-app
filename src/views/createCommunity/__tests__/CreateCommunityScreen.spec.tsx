import { assert } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import CreateCommunityScreen from '../index';

const mockStore = configureMockStore();
const store = mockStore({});

describe('CreateCommunity screen test suite', () => {
    let screen: ShallowWrapper<any>;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render CreateCommunity screen correctly', () => {
        givenScreen();
        thenItRenderProperly();
    });

    function givenScreen() {
        assert.isDefined(CreateCommunityScreen);

        screen = shallow(
            <Provider store={store}>
                <CreateCommunityScreen />
            </Provider>
        );
    }

    function thenItRenderProperly() {
        expect(screen).toMatchSnapshot();
    }
});
