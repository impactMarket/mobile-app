import { useNavigation } from '@react-navigation/core';
import { assert } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import { Screens } from 'helpers/constants';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import Beneficiaries from '../cards/Beneficiaries';
import Managers from '../cards/Managers';
import CommunityManagerScreen from '../index';
import AddBeneficiaryScreen from '../views/AddBeneficiaryScreen';

describe('CommunityManager test suite', () => {
    const navigate = jest.fn();
    const onChange = jest.fn();
    const handleModalScanQR = jest.fn();

    let screen: ShallowWrapper<any>;
    let card: ShallowWrapper<any>;

    const mockStore = configureMockStore();
    const store = mockStore({
        kit: { teste: '' },
        userCurrency: 'USD',
        userAddress: '0xc1912fEDSKJSA59aE311',
        rates: ['1'],
        communityContract: '0xc1912fEDSKJSA59aE311',
        hasManagerAcceptedRulesAlready: true,
        user: {
            community: {
                contract: '0xc1912fEDSKJSA59aE311',
                metadata: {
                    id: 2,
                    publicId: '3',
                    requestByAddress: '0xc1912fEDSKJSA59aE311',
                    contractAddress: '0xc1912fEDSKJSA59aE311',
                    name: 'Comunidade Teste',
                    description: 'description test',
                    descriptionEn: '',
                    language: 'EN',
                    currency: 'USD',
                    city: 'Lisbon',
                    country: 'Portugal',
                    gps: {},
                    email: 'mail',
                    visibility: 'public',
                    coverMediaId: 3,
                    status: 'valid',
                    started: new Date(),

                    // timestamps
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            },
        },
    });

    jest.mock('react-redux', () => ({
        useDispatch: () => {},
        useSelector: jest.fn().mockImplementation((func) => func()),
    }));

    const event = {
        target: {
            value: '0xc1912fEDSKJSA59aE311',
        },
    };

    beforeEach(() => {
        jest.resetAllMocks();
        (useEffect as jest.Mock).mockImplementation((f: any) => f());
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

        // TODO: Check the state drilldown problem
        // givenAddBeneficiaryScreen();
        // whenInformValoraAddressToAdd();
        // whenPressingButton('addBeneficiaryBtn');
        // thenMethodIsCalled();
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
