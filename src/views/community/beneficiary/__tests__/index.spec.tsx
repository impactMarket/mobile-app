import { assert } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import BeneficiaryScreen from '../index';

const mockStore = configureMockStore();
const store = mockStore({});

describe('Beneficiary screen test suite', () => {
    let screen: ShallowWrapper<any>;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render beneficiary screen correctly', () => {
        givenScreen();
        thenItRenderProperly();
    });

    function givenScreen() {
        assert.isDefined(BeneficiaryScreen);

        screen = shallow(
            <Provider store={store}>
                <BeneficiaryScreen />
            </Provider>
        );
    }

    function thenItRenderProperly() {
        expect(screen).toMatchSnapshot();
    }
});
