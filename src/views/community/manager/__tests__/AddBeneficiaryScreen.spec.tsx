import { renderWithRedux } from 'helpers/test/test-utils';
import { buildStore } from 'helpers/test/buildStore';
import { useNavigation, useRoute } from '@react-navigation/core';
import _ from 'lodash';
import React, { useEffect } from 'react';

import CommunityManagerScreen from '../index';

describe('CommunityManager Screen test', () => {
    const navigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
        isFocused: jest.fn(),
    };

    const route = {
        params: {} as any,
    };

    let props: any;

    const mockedState = {
        kit: {},
        userCurrency: 'USD',
        userAddress: '0x1231231231231231',
        rates: [],
        communityContract: '0x1231231231231231',
        hasManagerAcceptedRulesAlready: true,
        community: {
            id: 2,
            publicId: '3',
            requestByAddress: '123123123',
            contractAddress: '123123123',
            name: 'Comunidade Teste',
            description: '',
            descriptionEn: '',
            language: '',
            currency: '',
            city: '',
            country: '',
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

    // beforeEach(() => {
    //     // jest.resetAllMocks();

    //     (useEffect as jest.Mock).mockImplementation(_.once((f: any) => f()));
    //     route.params = {};

    //     navigation.isFocused.mockReturnValue(true);
    // });

    test('should render CommunityManagerScreen correctly', () => {
        const screen = givenMainComponentLoaded(<CommunityManagerScreen />);
        expect(screen).toBeDefined();
    });

    test('should render activity indicator when community is not loaded', async () => {
        const screen = givenMainComponentLoaded(<CommunityManagerScreen />);

        expect(await screen.getByTestId('activityIndicator')).toBeTruthy();
    });

    test('should render Add beneficiary card when community is not null', async () => {
        const screen = givenMainComponentLoaded(
            <CommunityManagerScreen />,
            mockedState
        );

        expect(await screen.getByTestId('beneficiariesCard')).toBeTruthy();
    });

    test('should render Add manager card when community is not null', async () => {
        const screen = givenMainComponentLoaded(
            <CommunityManagerScreen />,
            mockedState
        );

        expect(await screen.getByTestId('managersCard')).toBeTruthy();
    });

    function givenMainComponentLoaded(
        component: React.ReactElement,
        state?: object
    ) {
        return renderWithRedux(component, state);
    }
    // function thenItClosesScreen() {
    //     expect(navigation.goBack).toHaveBeenCalled();
    // }

    // function givenNavigation() {
    //     (useNavigation as jest.Mock).mockReturnValue(navigation);
    //     (useRoute as jest.Mock).mockReturnValue({
    //         params: {},
    //     });
    // }

    // function thenAppNavigateTo(r: string, prevScreen: boolean = true) {
    //     prevScreen
    //         ? expect(navigation.navigate).toHaveBeenCalledWith(r, {
    //               prevScreen,
    //           })
    //         : expect(navigation.navigate).toHaveBeenCalledWith(r);
    // }
});
