import { assert } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import ProfileScreen from '../index';

const mockStore = configureMockStore();
const store = mockStore({});

describe('Profile screen test suite', () => {
    let screen: ShallowWrapper<any>;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render Profile screen correctly', () => {
        givenScreen();
        thenItRenderProperly();
    });

    function givenScreen() {
        assert.isDefined(ProfileScreen);

        screen = shallow(
            <Provider store={store}>
                <ProfileScreen />
            </Provider>
        );
    }

    function thenItRenderProperly() {
        expect(screen).toMatchSnapshot();
    }
});
