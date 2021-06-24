import { useNavigation } from '@react-navigation/core';
import { assert } from 'chai';
import { shallow, ShallowWrapper, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Screens } from 'helpers/constants';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import Beneficiaries from '../cards/Beneficiaries';
import Managers from '../cards/Managers';
import CommunityManagerScreen from '../index';
import AddBeneficiaryScreen from '../views/AddBeneficiaryScreen';

const mockStore = configureMockStore();
const store = mockStore({});

configure({ adapter: new Adapter() });

describe('CommunityManager test suite', () => {
    const navigate = jest.fn();
    const onChange = jest.fn();
    const handleModalScanQR = jest.fn();

    let screen: ShallowWrapper<any>;
    let card: ShallowWrapper<any>;

    const event = {
        target: {
            value: '0xc1912fEDSKJSA59aE311',
        },
    };

    beforeEach(() => {
        jest.resetAllMocks();
        (useNavigation as jest.Mock).mockReturnValue({ navigate });
    });

    it('should render CommunityManager screen correctly', () => {
        givenScreen();
        thenScreenRenderProperly();
    });

    it('should render Beneficiary card when community is valid', () => {
        givenBeneficiariesCard();
        thenCardRenderProperly();
    });

    it('should render Manager card when community is valid', () => {
        givenManagerCard();
        thenCardRenderProperly();
    });

    it('should navigate to Add Beneficiary screen when addBeneficiary button is pressed', () => {
        givenBeneficiariesCard();
        thenCardRenderProperly();
        whenPressingButton('addBeneficiaryBtn');
        thenAppNavigateToScreen(Screens.AddBeneficiary);
    });

    it('should navigate to Added Beneficiary screen when addedBeneficiary button is pressed', () => {
        givenBeneficiariesCard();
        thenCardRenderProperly();
        whenPressingButton('addedBeneficiaryBtn');
        thenAppNavigateToScreen(Screens.AddedBeneficiary);
    });

    it('should navigate to Removed Beneficiary screen when removedBeneficiary button is pressed', () => {
        givenBeneficiariesCard();
        thenCardRenderProperly();
        whenPressingButton('removedBeneficiaryBtn');
        thenAppNavigateToScreen(Screens.RemovedBeneficiary);
    });

    it('should add Beneficiary when address is valid', () => {
        givenBeneficiariesCard();
        thenCardRenderProperly();
        whenPressingButton('addBeneficiaryBtn');
        thenAppNavigateToScreen(Screens.AddBeneficiary);
        givenAddBeneficiaryScreen();
        whenInformValoraAddressToAdd();
        whenPressingButton('addBeneficiaryBtn');
        thenMethodIsCalled();
    });

    function givenScreen() {
        assert.isDefined(CommunityManagerScreen);

        screen = shallow(
            <Provider store={store}>
                <CommunityManagerScreen />
            </Provider>
        );
    }

    function thenScreenRenderProperly() {
        expect(screen).toMatchSnapshot();
    }

    function thenCardRenderProperly() {
        expect(card).toMatchSnapshot();
    }

    function whenPressingButton(id: string) {
        const btn = card.find(`[testID="${id}"]`);
        expect(btn).toBeDefined();
        btn.simulate('press');
    }

    function thenMethodIsCalled() {
        expect(handleModalScanQR).toHaveBeenCalled();
    }

    function givenManagerCard() {
        assert.isDefined(Managers);

        card = shallow(
            <Provider store={store}>
                <Managers managers={2} />
            </Provider>
        );
    }

    function givenBeneficiariesCard() {
        assert.isDefined(Beneficiaries);

        card = shallow(
            <Beneficiaries
                beneficiaries={2}
                removedBeneficiaries={5}
                hasFundsToNewBeneficiary
                isSuspeciousDetected={false}
            />
        );
    }

    function givenAddBeneficiaryScreen() {
        assert.isDefined(AddBeneficiaryScreen);

        card = shallow(
            <Provider store={store}>
                <AddBeneficiaryScreen />
            </Provider>
        )
            .childAt(0)
            .dive();
    }

    function whenInformValoraAddressToAdd() {
        const textInput = card.find('beneficiaryAddressInput');
        expect(textInput).toBeDefined();
        textInput.simulate('change', event);
        expect(onChange).toHaveBeenCalledWith('0xc1912fEDSKJSA59aE311');
    }

    function thenAppNavigateToScreen(screen: string, params?: any) {
        if (params) {
            expect(navigate).toHaveBeenCalledWith(screen, params);
        } else {
            expect(navigate).toHaveBeenCalledWith(screen);
        }
    }
});
