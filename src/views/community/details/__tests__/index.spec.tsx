import { assert } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import { modalDonateAction } from 'helpers/constants';
import { createTestStore } from 'helpers/test/build-store';
import MockDate from 'mockdate';
import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { AnyAction, Store } from 'redux';
// import configureMockStore from 'redux-mock-store';

import Donate from '../donate';
import ConfirmModal from '../donate/modals/confirm';
import DonateModal from '../donate/modals/donate';
import ErrorModal from '../donate/modals/error';
import CommunityDetailsScreen from '../index';

// const mockStore = configureMockStore();
// const store = mockStore({});
let store: Store<any, AnyAction>;

describe('Community Details screen test suite', () => {
    let screen: ShallowWrapper<any>;
    let card: ShallowWrapper<any>;
    let modal: ShallowWrapper<any>;

    const donateWithCeloWallet = jest.fn();

    const onChange = jest.fn();
    const dispatch = jest.fn();

    let date = MockDate.set('2000-11-22');

    let route: {
        params: {
            communityId: 2;
            openDonate?: true;
            fromStories?: false;
        };
    };

    let community: {
        contract: {
            communityId: 1;
            claimAmount: '10';
            maxClaim: '100';
            baseInterval: 2;
            incrementInterval: 5;
            createdAt: date;
            updatedAt: date;
        };
        id: 2;
        publicId: '3';
        requestByAddress: '0xc1912fEDSKJSA59aE311';
        contractAddress: '0xc1912fEDSKJSA59aE311';
        name: 'Comunidade Teste';
        description: 'description test';
        descriptionEn: '';
        language: 'EN';
        currency: 'USD';
        city: 'Lisbon';
        country: 'Portugal';
        email: 'mail';
        visibility: 'public';
        coverMediaId: 3;
        status: 'valid';
        gps: { latitude: 1; longitude: 1 };
        started: date;
        createdAt: date;
        updatedAt: date;
    };

    beforeEach(() => {
        jest.resetAllMocks();
        store = createTestStore();
        (useDispatch as jest.Mock).mockReturnValue(dispatch);
        // (useStore as jest.Mock).mockReturnValue(store);
    });

    it('should render CommunityDetails screen correctly', () => {
        givenScreen();
        thenItRenderProperly();
    });

    it('should open Donation modal', () => {
        givenScreen();
        thenItRenderProperly();
        whenPressingButton('donate');
        thenSuccessActionsAreDispatch();
        // givenDonateModal();
        // whenInformValueToAdd();
        // whenPressingButtonInModal('donateWithValora');
        // givenConfirmModal();
        // whenPressingButtonInCard('donate');
        // thenMethodIsCalled();
    });

    function givenScreen() {
        assert.isDefined(CommunityDetailsScreen);

        screen = shallow(
            <Provider store={store}>
                <CommunityDetailsScreen route={route} />
            </Provider>
        )
            .childAt(0)
            .dive();
    }

    function thenMethodIsCalled() {
        expect(donateWithCeloWallet).toHaveBeenCalled();
    }

    function whenPressingButton(id: string) {
        const btn = screen.find(`[testID="${id}"]`);
        expect(btn).toBeDefined();
        btn.simulate('press');
    }

    function whenPressingButtonInModal(id: string) {
        const btn = card.find(`[testID="${id}"]`);
        expect(btn).toBeDefined();
        btn.simulate('press');
    }

    function whenPressingButtonInCard(id: string) {
        const btn = modal.find(`[testID="${id}"]`);
        expect(btn).toBeDefined();
        btn.simulate('press');
    }

    function whenInformValueToAdd() {
        const textInput = card.find('amountDonate');
        expect(textInput).toBeDefined();
        textInput.simulate('change', event);
        expect(onChange).toHaveBeenCalledWith('5');
    }

    function givenMainDonateModal() {
        assert.isDefined(Donate);

        card = shallow(
            <Provider store={store}>
                <Donate community={community} />
            </Provider>
        )
            .childAt(0)
            .dive();
    }

    function givenDonateModal() {
        assert.isDefined(Donate);

        screen = shallow(
            <Provider store={store}>
                <DonateModal />
            </Provider>
        );
    }

    function givenConfirmModal() {
        assert.isDefined(ConfirmModal);

        modal = shallow(
            <Provider store={store}>
                <ConfirmModal />
            </Provider>
        );
    }

    function thenSuccessActionsAreDispatch() {
        expect(dispatch).toHaveBeenNthCalledWith(1, {
            type: modalDonateAction.OPEN,
            payload: community,
        });
    }

    function thenItRenderProperly() {
        expect(screen).toMatchSnapshot();
    }
});
