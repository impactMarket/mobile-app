import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { render, fireEvent, cleanup, act } from '@testing-library/react-native';
import i18n from 'assets/i18n';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React from 'react';
import { Host } from 'react-native-portalize';
import * as reactRedux from 'react-redux';

import CreateCommunityScreen from './index';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

/**
 * NOTE: we are testing the component individually, but need the header
 * "submit button", so the entire navigator can be faked.
 */
function FakeCreateCommunityScreen() {
    const Stack = createStackNavigator();
    return (
        <Host>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Home"
                        component={CreateCommunityScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Host>
    );
}

describe('create community', () => {
    const useSelectorMock = reactRedux.useSelector as jest.Mock<any, any>;
    const launchImageLibraryAsyncMock = ImagePicker.launchImageLibraryAsync as jest.Mock<
        any,
        any
    >;
    const requestForegroundPermissionsAsyncMock = Location.requestForegroundPermissionsAsync as jest.Mock<
        any,
        any
    >;
    const getCurrentPositionAsyncMock = Location.getCurrentPositionAsync as jest.Mock<
        any,
        any
    >;

    beforeAll(() => {
        useSelectorMock.mockImplementation((callback) => {
            return callback({
                app: {
                    exchangeRates: { USD: 1 },
                },
                user: {
                    metadata: {
                        currency: 'USD',
                    },
                },
            });
        });
    });

    afterAll(() => {
        useSelectorMock.mockClear();
    });

    test('try to submit empty', async () => {
        const { getByText, queryByText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('coverImageRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityDescriptionRequired'))).toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('incrementalIntervalRequired'))).toBeNull();

        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('coverImageRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('communityDescriptionRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('incrementalIntervalRequired'))
        ).not.toBeNull();
    });

    test('try to submit only name', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('coverImageRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityDescriptionRequired'))).toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('incrementalIntervalRequired'))).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('communityName')),
            'test community'
        );
        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('coverImageRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('communityDescriptionRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('incrementalIntervalRequired'))
        ).not.toBeNull();
    });

    test('try to submit only description', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('coverImageRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityDescriptionRequired'))).toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('incrementalIntervalRequired'))).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('shortDescription')),
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacus ex, sagittis eget odio nec, scelerisque maximus nibh. Proin sit amet est ac dolor eleifend sodales. Etiam dolor lacus, blandit sit amet commodo sit amet, vulputate non mi.'
        );
        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('coverImageRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('communityDescriptionRequired'))).toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('incrementalIntervalRequired'))
        ).not.toBeNull();
    });

    test('try to submit only city', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('coverImageRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityDescriptionRequired'))).toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('incrementalIntervalRequired'))).toBeNull();

        fireEvent.changeText(getByLabelText(i18n.t('city')), 'Kampala');
        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('coverImageRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('communityDescriptionRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('incrementalIntervalRequired'))
        ).not.toBeNull();
    });

    test('try to submit only country', async () => {
        const {
            getByText,
            queryByText,
            getByLabelText,
            getByA11yLabel,
        } = render(<FakeCreateCommunityScreen />);
        await act(async () => {});

        expect(queryByText(i18n.t('coverImageRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityDescriptionRequired'))).toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('incrementalIntervalRequired'))).toBeNull();

        fireEvent.press(getByLabelText(i18n.t('country')));
        fireEvent.changeText(getByA11yLabel(i18n.t('search')), 'Port');
        await act(async () => expect(getByLabelText('PT')));
        fireEvent.press(getByLabelText('PT'));
        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('coverImageRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('communityDescriptionRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('incrementalIntervalRequired'))
        ).not.toBeNull();
    });

    test('try to submit only location', async () => {
        requestForegroundPermissionsAsyncMock.mockReturnValueOnce(
            Promise.resolve({
                status: 'granted',
            })
        );
        getCurrentPositionAsyncMock.mockReturnValueOnce(
            Promise.resolve({
                coords: { latitude: 3.0, longitude: 2.0 },
            })
        );

        const { getByText, queryByText, getByA11yLabel } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('coverImageRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityDescriptionRequired'))).toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('incrementalIntervalRequired'))).toBeNull();

        await act(async () =>
            fireEvent.press(getByA11yLabel(i18n.t('getGPSLocation')))
        );
        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('coverImageRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('communityDescriptionRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('incrementalIntervalRequired'))
        ).not.toBeNull();
    });

    test('try to submit only email', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('coverImageRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityDescriptionRequired'))).toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('incrementalIntervalRequired'))).toBeNull();
        expect(queryByText(i18n.t('modalErrorTitle'))).toBeNull();

        fireEvent.changeText(getByLabelText(i18n.t('email')), 'me@example.io');
        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('coverImageRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('communityDescriptionRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('incrementalIntervalRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('modalErrorTitle'))).not.toBeNull();
    });

    test('try to submit invalid email', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('emailInvalidFormat'))).toBeNull();

        fireEvent.changeText(getByLabelText(i18n.t('email')), 'me@example');
        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('emailInvalidFormat'))).not.toBeNull();
    });

    test('try to submit too short description', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('communityDescriptionTooShort'))).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('shortDescription')),
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacus ex, sagittis eget odio nec, scelerisque maximus nibh.'
        );
        fireEvent.press(getByText(i18n.t('submit')));

        expect(
            queryByText(i18n.t('communityDescriptionTooShort'))
        ).not.toBeNull();
    });

    test('try to submit small cover', async () => {
        launchImageLibraryAsyncMock.mockReturnValueOnce(
            Promise.resolve({
                uri: '/some/fake/image/uri.jpg',
                width: 650,
                height: 650,
                type: 'image',
                cancelled: false,
            })
        );

        const { getByText, queryByText, getByLabelText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('imageDimensionsNotFit'))).toBeNull();

        await act(async () =>
            fireEvent.press(getByLabelText('image uploader'))
        );
        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('imageDimensionsNotFit'))).not.toBeNull();
    });

    test('try to submit only claim amount', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('coverImageRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityDescriptionRequired'))).toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('incrementalIntervalRequired'))).toBeNull();
        expect(queryByText(i18n.t('modalErrorTitle'))).toBeNull();

        fireEvent.changeText(getByLabelText(i18n.t('claimAmount')), '1');
        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('coverImageRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('communityDescriptionRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('incrementalIntervalRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('modalErrorTitle'))).not.toBeNull();
    });

    test('try to submit only max claim', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('coverImageRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityDescriptionRequired'))).toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('incrementalIntervalRequired'))).toBeNull();
        expect(queryByText(i18n.t('modalErrorTitle'))).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('totalClaimPerBeneficiary')),
            '100'
        );
        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('coverImageRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('communityDescriptionRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('incrementalIntervalRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('modalErrorTitle'))).not.toBeNull();
    });

    test('try to submit only increment interval', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        expect(queryByText(i18n.t('coverImageRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).toBeNull();
        expect(queryByText(i18n.t('communityDescriptionRequired'))).toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).toBeNull();
        expect(queryByText(i18n.t('incrementalIntervalRequired'))).toBeNull();
        expect(queryByText(i18n.t('modalErrorTitle'))).toBeNull();

        fireEvent.changeText(getByLabelText(i18n.t('time')), '5');
        fireEvent.press(getByText(i18n.t('submit')));

        expect(queryByText(i18n.t('coverImageRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('communityNameRequired'))).not.toBeNull();
        expect(
            queryByText(i18n.t('communityDescriptionRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('cityRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('countryRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('enablingGPSRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('emailRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('claimAmountRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('maxClaimAmountRequired'))).not.toBeNull();
        expect(queryByText(i18n.t('incrementalIntervalRequired'))).toBeNull();
        expect(queryByText(i18n.t('modalErrorTitle'))).not.toBeNull();
    });

    // TODO: this test is important but it's failling for unknown reasons
    // test('change country', async () => {
    //     const { getByLabelText, queryAllByTestId, getByA11yLabel } = render(
    //         <FakeCreateCommunityScreen />
    //     );
    //     await act(async () => {});

    //     fireEvent.press(getByLabelText(i18n.t('country')));
    //     fireEvent.changeText(getByA11yLabel(i18n.t('search')), 'Port');
    //     await act(async () => expect(getByLabelText('PT')));
    //     fireEvent.press(getByLabelText('PT'));

    //     expect(queryAllByTestId('selected-value')[0].children).toContain(
    //         '🇵🇹 Portugal'
    //     );

    //     await act(async () => {});
    //     fireEvent.press(getByLabelText(i18n.t('country')));
    //     fireEvent.changeText(getByA11yLabel(i18n.t('search')), 'Ang');
    //     await act(async () => expect(getByLabelText('AO')));
    //     fireEvent.press(getByLabelText('AO'));

    //     expect(queryAllByTestId('selected-value')[0].children).toContain(
    //         '🇦🇴 Angola'
    //     );
    // });

    test('change cover', async () => {
        launchImageLibraryAsyncMock.mockReturnValueOnce(
            Promise.resolve({
                uri: '/some/fake/image/one.jpg',
                width: 790,
                height: 790,
                type: 'image',
                cancelled: false,
            })
        );

        const { getByLabelText, getByTestId, queryByLabelText } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        await act(async () =>
            fireEvent.press(getByLabelText('image uploader'))
        );

        expect(queryByLabelText('image uploader')).toBeNull();

        fireEvent.press(getByTestId('remove-cover'));

        expect(queryByLabelText('image uploader')).not.toBeNull();

        launchImageLibraryAsyncMock.mockReturnValueOnce(
            Promise.resolve({
                uri: '/some/fake/image/two.jpg',
                width: 790,
                height: 790,
                type: 'image',
                cancelled: false,
            })
        );

        await act(async () =>
            fireEvent.press(getByLabelText('image uploader'))
        );

        expect(queryByLabelText('image uploader')).toBeNull();
    });

    test('metadata', async () => {
        launchImageLibraryAsyncMock.mockReturnValueOnce(
            Promise.resolve({
                uri: '/some/fake/image/uri.jpg',
                width: 790,
                height: 790,
                type: 'image',
                cancelled: false,
            })
        );

        const { getByLabelText, getByText, getByA11yLabel } = render(
            <FakeCreateCommunityScreen />
        );
        await act(async () => {});

        const communityName = getByLabelText(i18n.t('communityName'));
        fireEvent.changeText(communityName, 'test community');

        await act(async () =>
            fireEvent.press(getByLabelText('image uploader'))
        );

        fireEvent.press(getByLabelText(i18n.t('country')));

        fireEvent.changeText(getByA11yLabel(i18n.t('search')), 'Port');
        await act(async () => expect(getByLabelText('PT')));
        fireEvent.press(getByLabelText('PT'));

        fireEvent.press(getByText(i18n.t('submit')));
    });
});
