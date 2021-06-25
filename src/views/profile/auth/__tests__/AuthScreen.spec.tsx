import { assert } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import Auth from '../index';

const mockStore = configureMockStore();
const store = mockStore({});

describe('Auth screen test suite', () => {
    let screen: ShallowWrapper<any>;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render Auth screen correctly', () => {
        givenScreen();
        thenItRenderProperly();
    });

    function givenScreen() {
        assert.isDefined(Auth);

        screen = shallow(
            <Provider store={store}>
                <Auth />
            </Provider>
        );
    }

    function thenItRenderProperly() {
        expect(screen).toMatchSnapshot();
    }
});
