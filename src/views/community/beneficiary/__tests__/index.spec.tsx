import { assert } from 'chai';
import { shallow, ShallowWrapper, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { clear } from 'jest-date-mock';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import BeneficiaryScreen from '../index';

const mockStore = configureMockStore();
const store = mockStore({});

configure({ adapter: new Adapter() });

describe('Beneficiary screen test', () => {
    let wrapper: ShallowWrapper;
    let navigation: any;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        clear();
    });

    it('should render beneficiary screen correctly', () => {
        givenComponent();
        thenItRenderProperly();
    });

    it('should exists', function () {});

    function givenComponent() {
        assert.isDefined(BeneficiaryScreen);

        wrapper = shallow(
            <Provider store={store}>
                <BeneficiaryScreen />
            </Provider>
        );
    }

    function thenItRenderProperly() {
        expect(wrapper).toMatchSnapshot();
    }
});
