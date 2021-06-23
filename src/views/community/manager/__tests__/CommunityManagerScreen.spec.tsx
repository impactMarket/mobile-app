import { fireEvent, waitFor } from '@testing-library/react-native';
import { Screens } from 'helpers/constants';
import { renderWithRedux } from 'helpers/test/test-utils';
import _ from 'lodash';
import React from 'react';

import Beneficiaries from '../cards/Beneficiaries';
import Managers from '../cards/Managers';
import CommunityManagerScreen from '../index';
import AddBeneficiaryScreen from '../views/AddBeneficiaryScreen';

jest.mock('@react-navigation/native', () => {
    return {
        ...jest.requireActual('@react-navigation/native'),
        useFocusEffect: () => jest.fn(),
        useNavigation: () => ({
            navigate: jest.fn(),
            dispatch: jest.fn(),
        }),
    };
});

describe('CommunityManager Screen Unit tests', () => {
    jest.useFakeTimers();

    const mockedState = {
        kit: { teste: '' },
        userCurrency: 'USD',
        userAddress: '0xc1912fEDSKJSA59aE311',
        rates: ['1'],
        communityContract: '0xc1912fEDSKJSA59aE311',
        hasManagerAcceptedRulesAlready: true,
        community: {
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
    };

    test('should render CommunityManagerScreen correctly', () => {
        const screen = givenMainComponentLoaded(<CommunityManagerScreen />);
        thenItRenderProperly(screen);
    });

    test('should render activity indicator when community is not loaded', async () => {
        const screen = givenMainComponentLoaded(<CommunityManagerScreen />);

        expect(await screen.getByTestId('activityIndicator')).toBeTruthy();
    });

    test('should render Beneficiary card when community is valid', async () => {
        const screen = givenMainComponentLoaded(
            <Beneficiaries
                beneficiaries={2}
                removedBeneficiaries={5}
                hasFundsToNewBeneficiary
                isSuspeciousDetected={false}
            />,
            mockedState
        );

        expect(await screen.getByTestId('beneficiariesCard')).toBeTruthy();
    });

    test('should render Manager card when community is valid', async () => {
        const screen = givenMainComponentLoaded(
            <Managers managers={2} />,
            mockedState
        );

        expect(await screen.getByTestId('managersCard')).toBeTruthy();
    });

    test('should navigate to Added beneficiary screen when click on Added Beneficiary button', async () => {
        const screen = givenMainComponentLoaded(
            <Beneficiaries
                beneficiaries={2}
                removedBeneficiaries={5}
                hasFundsToNewBeneficiary
                isSuspeciousDetected={false}
            />,
            mockedState
        );

        const button = await screen.getByTestId('addedBeneficiaryBtn');
        fireEvent.press(button);

        thenNavigateToTheAddedBeneficiaryScreen();
    });

    test('should navigate to Removed beneficiaries screen when click on Removed Beneficiaries button', async () => {
        const screen = givenMainComponentLoaded(
            <Beneficiaries
                beneficiaries={2}
                removedBeneficiaries={5}
                hasFundsToNewBeneficiary
                isSuspeciousDetected={false}
            />,
            mockedState
        );

        const button = await screen.getByTestId('removedBeneficiaryBtn');
        fireEvent.press(button);

        thenNavigateToTheRemovedBeneficiaryScreen();
    });

    test('should navigate to Add beneficiaries screen when click on Add Beneficiaries button', async () => {
        const screen = givenMainComponentLoaded(
            <Beneficiaries
                beneficiaries={2}
                removedBeneficiaries={5}
                hasFundsToNewBeneficiary
                isSuspeciousDetected={false}
            />,
            mockedState
        );

        const button = await screen.getByTestId('addBeneficiaryBtn');
        fireEvent.press(button);

        thenNavigateToTheAddBeneficiaryScreen();
    });

    test('should be able to Add beneficiaries', async () => {
        const screen = givenMainComponentLoaded(
            <Beneficiaries
                beneficiaries={2}
                removedBeneficiaries={5}
                hasFundsToNewBeneficiary
                isSuspeciousDetected={false}
            />,
            mockedState
        );

        const button = await screen.getByTestId('addBeneficiaryBtn');
        fireEvent.press(button);

        thenNavigateToTheAddBeneficiaryScreen();
        const addBeneficiaryScreen = givenAddBeneficiaryScreen(
            <AddBeneficiaryScreen />,
            mockedState
        );

        const beneficiaryAddressInput = addBeneficiaryScreen.getByTestId(
            'beneficiaryAddressInput'
        );
        fireEvent.changeText(beneficiaryAddressInput, '0xc1912fEDSKJSA59aE311');

        const addBeneficiaryBtn = addBeneficiaryScreen.getByTestId(
            'addBeneficiaryBtn'
        );

        fireEvent.press(addBeneficiaryBtn);

        await waitFor(() =>
            expect(addBeneficiaryBtn.props.onPress().toHaveBeenCalled())
        );
    });

    function givenMainComponentLoaded(
        component: React.ReactElement,
        state?: object
    ) {
        return renderWithRedux(component, state);
    }

    function thenItRenderProperly(screen: any) {
        expect(screen).toMatchSnapshot();
    }

    function thenNavigateToTheAddedBeneficiaryScreen() {
        expect(navigate).toHaveBeenCalledTimes(1);
        // expect(mockedDispatch).toHaveBeenCalledWith(Screens.AddedBeneficiary);
    }

    function thenNavigateToTheRemovedBeneficiaryScreen() {
        expect(navigate).toHaveBeenCalledTimes(1);
        // expect(mockedDispatch).toHaveBeenCalledWith(Screens.RemovedBeneficiary);
    }

    function thenNavigateToTheAddBeneficiaryScreen() {
        expect(navigate).toHaveBeenCalledTimes(1);
        // expect(mockedDispatch).toHaveBeenCalledWith(Screens.AddBeneficiary);
    }

    function givenAddBeneficiaryScreen(
        component: React.ReactElement,
        state?: object
    ) {
        return renderWithRedux(component, state);
    }
});
