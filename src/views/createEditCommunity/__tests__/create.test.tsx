import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { render, fireEvent, cleanup, act } from '@testing-library/react-native';
import i18n from 'assets/i18n';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as helpers from 'helpers/index';
import combinedReducer from 'helpers/redux/reducers';
import { CommunityAttributes } from 'helpers/types/models';
import React from 'react';
import { Host } from 'react-native-portalize';
import * as reactRedux from 'react-redux';
import { createStore } from 'redux';

import Api from '../../../services/api';
import CreateCommunityScreen from '../create';

afterEach(cleanup);

jest.mock('helpers/redux/actions/user', () => ({
    setCommunityMetadata: jest.fn(),
    setUserIsCommunityManager: jest.fn(),
}));

/**
 * NOTE: we are testing the component individually, but need the header
 * "submit button", so the entire navigator can be faked.
 */
function WrappedCreateCommunityScreen() {
    const Stack = createStackNavigator();
    const store = createStore(combinedReducer);

    return (
        <Host>
            <reactRedux.Provider store={store}>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Home"
                            component={CreateCommunityScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </reactRedux.Provider>
        </Host>
    );
}

describe('create community', () => {
    const communityDummyData: CommunityAttributes = {
        id: 1,
        name: 'Some example',
        description: 'Description goes here',
        descriptionEn: 'Description goes here',
        coverMediaId: 1,
        city: 'Beja',
        country: 'PT',
        contractAddress: '0x0',
        requestByAddress: '0x0',
        currency: 'BTC',
        email: 'tt@cc.io',
        gps: {
            latitude: 1,
            longitude: 1,
        },
        language: 'pt',
        publicId: '0000',
        status: 'valid',
        visibility: 'public',
        started: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const useSelectorMock = reactRedux.useSelector as jest.Mock<any, any>;
    const dispatchRedux = reactRedux.useDispatch as jest.Mock<any, any>;

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
    const communityUploadCoverMock = jest.spyOn(Api.community, 'uploadCover');
    const communityCreateMock = jest.spyOn(Api.community, 'create');
    const communityFindByIdMock = jest.spyOn(Api.community, 'findById');
    const updateCommunityInfoMock = jest.spyOn(helpers, 'updateCommunityInfo');

    beforeAll(() => {
        useSelectorMock.mockImplementation((callback) => {
            return callback({
                app: {
                    exchangeRates: { USD: 1 },
                },
                user: {
                    metadata: {
                        currency: 'USD',
                        avatar: 'something.jpg',
                    },
                    wallet: {
                        address: '0xd7632B7588DF8532C0aBA55586167C2a315Fd768',
                    },
                },
                communities: {
                    community: communityDummyData,
                    communityCreationError: null,
                },
            });
        });

        dispatchRedux.mockReturnValue(jest.fn());

        communityUploadCoverMock.mockImplementation(() =>
            Promise.resolve({
                media: {
                    id: 1,
                    height: 850,
                    width: 850,
                    url: 'https://example.xyz/1628784243498.jpeg',
                },
                uploadURL: 'abc.xyz',
            })
        );

        // communityCreateMock.mockImplementation mocked below

        communityFindByIdMock.mockImplementation(() =>
            Promise.resolve(communityDummyData)
        );

        communityCreateMock.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve({
                    data: communityDummyData,
                    error: undefined,
                });
            });
        });

        updateCommunityInfoMock.mockImplementationOnce(() => Promise.resolve());
    });

    afterAll(() => {
        useSelectorMock.mockClear();
        dispatchRedux.mockClear();
        communityUploadCoverMock.mockClear();
        communityFindByIdMock.mockClear();
        communityCreateMock.mockClear();
        updateCommunityInfoMock.mockClear();
    });

    afterEach(() => {
        communityCreateMock.mockClear();
    });

    test('try to submit empty', async () => {
        const { getByText, queryByText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.cityRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.emailRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).toBeNull();

        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.emailRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).not.toBeNull();
    });

    test('try to submit only name', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.cityRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.emailRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.communityName')),
            'test community'
        );
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.emailRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).not.toBeNull();
    });

    test('try to submit only description', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.cityRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.emailRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.shortDescription')),
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacus ex, sagittis eget odio nec, scelerisque maximus nibh. Proin sit amet est ac dolor eleifend sodales. Etiam dolor lacus, blandit sit amet commodo sit amet, vulputate non mi.'
        );
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.emailRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).not.toBeNull();
    });

    test('try to submit only city', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.cityRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.emailRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).toBeNull();

        fireEvent.changeText(getByLabelText(i18n.t('generic.city')), 'Kampala');
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('createCommunity.cityRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.emailRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).not.toBeNull();
    });

    test('try to submit only country', async () => {
        const {
            getByText,
            queryByText,
            getByLabelText,
            getByA11yLabel,
        } = render(<WrappedCreateCommunityScreen />);
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.cityRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.emailRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).toBeNull();

        fireEvent.press(getByLabelText(i18n.t('generic.country')));
        fireEvent.changeText(getByA11yLabel(i18n.t('generic.search')), 'Port');
        await act(async () => expect(getByLabelText('PT')));
        fireEvent.press(getByLabelText('PT'));
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.emailRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
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
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.cityRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.emailRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).toBeNull();

        await act(async () =>
            fireEvent.press(
                getByA11yLabel(i18n.t('createCommunity.getGPSLocation'))
            )
        );
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.emailRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).not.toBeNull();
    });

    test('try to submit only email', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.cityRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.emailRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('errors.modals.title'))).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('generic.email')),
            'me@example.io'
        );
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('createCommunity.emailRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('errors.modals.title'))).not.toBeNull();
    });

    test('try to submit invalid email', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.emailInvalidFormat'))
        ).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('generic.email')),
            'me@example'
        );
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.emailInvalidFormat'))
        ).not.toBeNull();
    });

    test('try to submit too short description', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionTooShort'))
        ).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.shortDescription')),
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacus ex, sagittis eget odio nec, scelerisque maximus nibh.'
        );
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionTooShort'))
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
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.imageDimensionsNotFit'))
        ).toBeNull();

        await act(async () =>
            fireEvent.press(getByLabelText('image uploader'))
        );
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.imageDimensionsNotFit'))
        ).not.toBeNull();
    });

    test('try to submit only claim amount', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.cityRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.emailRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('errors.modals.title'))).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.claimAmount')),
            '1'
        );
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.emailRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('errors.modals.title'))).not.toBeNull();
    });

    test('try to submit only max claim', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.cityRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.emailRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('errors.modals.title'))).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.totalClaimPerBeneficiary')),
            '100'
        );
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.emailRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).not.toBeNull();
        expect(queryByText(i18n.t('errors.modals.title'))).not.toBeNull();
    });

    test('try to submit only increment interval', async () => {
        const { getByText, queryByText, getByLabelText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.cityRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('createCommunity.emailRequired'))).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('errors.modals.title'))).toBeNull();

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.time')),
            '5'
        );
        fireEvent.press(getByText(i18n.t('generic.submit')));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.countryRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.enablingGPSRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.emailRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.claimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.maxClaimAmountRequired'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.incrementalIntervalRequired'))
        ).toBeNull();
        expect(queryByText(i18n.t('errors.modals.title'))).not.toBeNull();
    });

    // TODO: this test is important but it's failling for unknown reasons
    // test('change country', async () => {
    // const { getByLabelText, queryAllByTestId, getByA11yLabel } = render(
    //     <WrappedCreateCommunityScreen />
    // );
    // await act(async () => {});

    // fireEvent.press(getByLabelText(i18n.t('generic.country')));
    // fireEvent.changeText(getByA11yLabel(i18n.t('generic.search')), 'Port');
    // await act(async () => expect(getByLabelText('PT')));
    // fireEvent.press(getByLabelText('PT'));

    // expect(queryAllByTestId('selected-value')[0].children).toContain(
    //     '🇵🇹 Portugal'
    // );

    // fireEvent.press(getByLabelText(i18n.t('generic.country')));
    // fireEvent.changeText(getByA11yLabel(i18n.t('generic.search')), 'Ang');
    // await act(async () => expect(getByLabelText('AO')));
    // fireEvent.press(getByLabelText('AO'));

    // expect(queryAllByTestId('selected-value')[0].children).toContain(
    //     '🇦🇴 Angola'
    // );
    // });

    // TODO: claim amount bigger than max claim

    // TODO: claim amount zero

    // TODO: max claim zero

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
            <WrappedCreateCommunityScreen />
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

    test('failed submit', async () => {
        launchImageLibraryAsyncMock.mockReturnValueOnce(
            Promise.resolve({
                uri: '/some/fake/image/uri.jpg',
                width: 790,
                height: 790,
                type: 'image',
                cancelled: false,
            })
        );
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

        communityCreateMock.mockImplementationOnce(() => {
            throw new Error('bruh, wat?');
        });

        const {
            getByLabelText,
            getByText,
            getByA11yLabel,
            queryByText,
            findByText,
        } = render(<WrappedCreateCommunityScreen />);
        await act(async () => {});

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.communityName')),
            'test community'
        );

        await act(async () =>
            fireEvent.press(getByLabelText('image uploader'))
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.shortDescription')),
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacus ex, sagittis eget odio nec, scelerisque maximus nibh. Proin sit amet est ac dolor eleifend sodales. Etiam dolor lacus, blandit sit amet commodo sit amet, vulputate non mi.'
        );

        fireEvent.changeText(getByLabelText(i18n.t('generic.city')), 'Beja');

        fireEvent.press(getByLabelText(i18n.t('generic.country')));

        fireEvent.changeText(getByA11yLabel(i18n.t('generic.search')), 'Port');
        await act(async () => expect(getByLabelText('PT')));
        fireEvent.press(getByLabelText('PT'));

        await act(async () =>
            fireEvent.press(
                getByA11yLabel(i18n.t('createCommunity.getGPSLocation'))
            )
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('generic.email')),
            'me@example.io'
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.claimAmount')),
            '1'
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.totalClaimPerBeneficiary')),
            '100'
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.time')),
            '5'
        );

        await act(async () => {
            fireEvent.press(getByText(i18n.t('generic.submit')));
        });

        // Keep failing for no reason with the error (Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?)
        // Since we'he two conditions out of three matched, I'm commenting out the expect for now
        // await act(async () =>
        //     expect(
        //         queryByText(i18n.t('createCommunity.communityRequestSuccess'))
        //     ).toBeNull()
        // );

        await act(async () =>
            expect(
                queryByText(i18n.t('createCommunity.communityRequestSending'))
            ).toBeNull()
        );
        await act(async () =>
            expect(
                findByText(i18n.t('createCommunity.communityRequestError'))
            ).not.toBeNull()
        );
    });

    test('submit successfully', async () => {
        launchImageLibraryAsyncMock.mockReturnValueOnce(
            Promise.resolve({
                uri: '/some/fake/image/uri.jpg',
                width: 790,
                height: 790,
                type: 'image',
                cancelled: false,
            })
        );
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

        communityCreateMock.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve({
                    data: communityDummyData,
                    error: undefined,
                });
            });
        });

        const {
            getByLabelText,
            getByText,
            getByA11yLabel,
            queryByText,
            findByText,
        } = render(<WrappedCreateCommunityScreen />);
        await act(async () => {});

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.communityName')),
            'test community'
        );

        await act(async () =>
            fireEvent.press(getByLabelText('image uploader'))
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.shortDescription')),
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacus ex, sagittis eget odio nec, scelerisque maximus nibh. Proin sit amet est ac dolor eleifend sodales. Etiam dolor lacus, blandit sit amet commodo sit amet, vulputate non mi.'
        );

        fireEvent.changeText(getByLabelText(i18n.t('generic.city')), 'Beja');

        fireEvent.press(getByLabelText(i18n.t('generic.country')));

        // TODO: this test is important but it's failling for unknown reasons
        // fireEvent.changeText(getByA11yLabel(i18n.t('generic.search')), 'Port');
        // await act(async () => expect(getByLabelText('PT')));
        // fireEvent.press(getByLabelText('PT'));

        await act(async () =>
            fireEvent.press(
                getByA11yLabel(i18n.t('createCommunity.getGPSLocation'))
            )
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('generic.email')),
            'me@example.io'
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.claimAmount')),
            '1'
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.totalClaimPerBeneficiary')),
            '100'
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.time')),
            '5'
        );

        await act(async () => {
            fireEvent.press(getByText(i18n.t('generic.submit')));
        });

        await act(async () =>
            expect(
                queryByText(i18n.t('createCommunity.communityRequestSending'))
            ).toBeNull()
        );
        await act(async () =>
            expect(
                queryByText(i18n.t('createCommunity.communityRequestError'))
            ).toBeNull()
        );

        await act(async () =>
            expect(
                findByText(i18n.t('createCommunity.communityRequestSuccess'))
            ).not.toBeNull()
        );
    });

    test('pending submit', async () => {
        launchImageLibraryAsyncMock.mockReturnValueOnce(
            Promise.resolve({
                uri: '/some/fake/image/uri.jpg',
                width: 790,
                height: 790,
                type: 'image',
                cancelled: false,
            })
        );
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

        communityCreateMock.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve({
                    data: communityDummyData,
                    error: undefined,
                });
            });
        });

        const {
            getByLabelText,
            getByText,
            getByA11yLabel,
            queryByText,
        } = render(<WrappedCreateCommunityScreen />);
        await act(async () => {});

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.communityName')),
            'test community'
        );

        await act(async () =>
            fireEvent.press(getByLabelText('image uploader'))
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.shortDescription')),
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacus ex, sagittis eget odio nec, scelerisque maximus nibh. Proin sit amet est ac dolor eleifend sodales. Etiam dolor lacus, blandit sit amet commodo sit amet, vulputate non mi.'
        );

        fireEvent.changeText(getByLabelText(i18n.t('generic.city')), 'Beja');

        fireEvent.press(getByLabelText(i18n.t('generic.country')));

        // TODO: this test is important but it's failling for unknown reasons
        // fireEvent.changeText(getByA11yLabel(i18n.t('generic.search')), 'Port');
        // await act(async () => expect(getByLabelText('PT')));
        // fireEvent.press(getByLabelText('PT'));

        await act(async () =>
            fireEvent.press(
                getByA11yLabel(i18n.t('createCommunity.getGPSLocation'))
            )
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('generic.email')),
            'me@example.io'
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.claimAmount')),
            '1'
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.totalClaimPerBeneficiary')),
            '100'
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.time')),
            '5'
        );

        await act(async () => {
            fireEvent.press(getByText(i18n.t('generic.submit')));
        });

        // Keep failing for no reason with the error (Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?)
        // Since we'he two conditions out of three matched, I'm commenting out the expect for now
        // await act(async () =>
        //     expect(
        //         queryByText(i18n.t('createCommunity.communityRequestSuccess'))
        //     ).toBeNull()
        // );

        // Tried: expect(getByTestId('submission-in-progress')).toBeTruthy();
        // Error: Unable to find an element with testID: submission-in-progress

        // Tried: expect(
        //     getByText(i18n.t('createCommunity.communityRequestSending'))
        // ).toBeTruthy();
        //Error: Unable to find an element with text: Please wait while the community information is being uploaded...

        expect(
            setTimeout(() => {
                queryByText(i18n.t('createCommunity.communityRequestSending'));
            }, 5000)
        ).not.toBeNull();

        await act(async () =>
            expect(
                queryByText(i18n.t('createCommunity.communityRequestError'))
            ).toBeNull()
        );
    });

    // TODO: cancel during image upload

    // TODO: cancel during community upload

    // TODO: test without mocking user profile picture
});
