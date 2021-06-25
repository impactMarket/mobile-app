import { assert } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import FAQScreen from '../index';

const mockStore = configureMockStore();
const store = mockStore({});

describe('FAQ screen test suite', () => {
    let screen: ShallowWrapper<any>;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render FAQ screen correctly', () => {
        givenScreen();
        thenItRenderProperly();
    });

    function givenScreen() {
        assert.isDefined(FAQScreen);

        screen = shallow(
            <Provider store={store}>
                <FAQScreen />
            </Provider>
        );
    }

    function thenItRenderProperly() {
        expect(screen).toMatchSnapshot();
    }
});
