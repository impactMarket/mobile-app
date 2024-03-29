import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { render, fireEvent, cleanup, act } from '@testing-library/react-native';
import i18n from 'assets/i18n';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as helpers from 'helpers/index';
import { CommunityAttributes } from 'helpers/types/models';
import mockAxios from 'jest-mock-axios';
import React from 'react';
import { Button, View } from 'react-native';
import { Host } from 'react-native-portalize';
import * as reactRedux from 'react-redux';

import Api from '../../../services/api';
import CreateCommunityScreen from '../create';

afterEach(cleanup);

jest.mock('helpers/redux/actions/user', () => ({
    setCommunityMetadata: jest.fn(),
    setUserManager: jest.fn(),
}));

jest.mock('../component/PlaceSearch');

/**
 * NOTE: we are testing the component individually, but need the header
 * "submit button", so the entire navigator can be faked.
 */
function WrappedCreateCommunityScreen() {
    const Stack = createStackNavigator();

    function HomeScreen({ navigation }: any) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Button
                    title="Create Community"
                    testID="create-community-button"
                    onPress={() => navigation.navigate('CreateCommunity')}
                />
            </View>
        );
    }

    return (
        <Host>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen
                        name="CreateCommunity"
                        component={CreateCommunityScreen}
                    />
                    <Stack.Screen name="Home" component={HomeScreen} />
                </Stack.Navigator>
            </NavigationContainer>
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
    const launchImageLibraryAsyncMock =
        ImagePicker.launchImageLibraryAsync as jest.Mock<any, any>;
    const requestForegroundPermissionsAsyncMock =
        Location.requestForegroundPermissionsAsync as jest.Mock<any, any>;
    const getCurrentPositionAsyncMock =
        Location.getCurrentPositionAsync as jest.Mock<any, any>;
    const communityPreSignedUrlMock = jest.spyOn(Api.community, 'preSignedUrl');
    const communityUploadCoverMock = jest.spyOn(Api.community, 'uploadImage');
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
                        language: 'pt',
                    },
                    wallet: {
                        address: '0xd7632B7588DF8532C0aBA55586167C2a315Fd768',
                    },
                },
            });
        });

        communityPreSignedUrlMock.mockImplementation(() =>
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

        communityUploadCoverMock.mockImplementation(() =>
            Promise.resolve(true)
        );

        // communityCreateMock.mockImplementation mocked below

        communityFindByIdMock.mockImplementation(() =>
            Promise.resolve(communityDummyData)
        );

        updateCommunityInfoMock.mockImplementationOnce(() => Promise.resolve());
    });

    afterAll(() => {
        useSelectorMock.mockClear();
        communityUploadCoverMock.mockClear();
        communityFindByIdMock.mockClear();
        updateCommunityInfoMock.mockClear();
    });

    test('try to submit empty', async () => {
        const { getByText, queryByText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
        expect(
            queryByText(i18n.t('createCommunity.baseIntervalRequired'))
        ).not.toBeNull();
        expect(
            queryByText(
                i18n.t('createCommunity.incrementalIntervalUnitRequired')
            )
        ).not.toBeNull();
    });

    test('try to submit only name', async () => {
        const { getByText, queryByText, getByLabelText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
        expect(
            queryByText(i18n.t('createCommunity.baseIntervalRequired'))
        ).not.toBeNull();
        expect(
            queryByText(
                i18n.t('createCommunity.incrementalIntervalUnitRequired')
            )
        ).not.toBeNull();
    });

    test('try to submit only description', async () => {
        const { getByText, queryByText, getByLabelText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
        expect(
            queryByText(i18n.t('createCommunity.baseIntervalRequired'))
        ).not.toBeNull();
        expect(
            queryByText(
                i18n.t('createCommunity.incrementalIntervalUnitRequired')
            )
        ).not.toBeNull();
    });

    test('try to submit only city', async () => {
        const {
            getByText,
            queryByText,
            getByLabelText,
            getByPlaceholderText,
            getByTestId,
        } = render(<WrappedCreateCommunityScreen />);
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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

        fireEvent.changeText(getByLabelText(i18n.t('generic.cityCountry')), '');
        fireEvent.changeText(
            getByPlaceholderText(i18n.t('generic.search')),
            'Beja, Portugal'
        );

        await act(async () => fireEvent.press(getByTestId('select-place')));

        await act(async () => {
            const req = mockAxios.getReqByMatchUrl(/maps\.googleapis\.com/gm);
            mockAxios.mockResponse(
                {
                    data: {
                        result: {
                            geometry: { location: { lat: 1, lng: 1 } },
                            address_components: [
                                { short_name: 'PT', types: ['country'] },
                            ],
                        },
                    },
                },
                req
            );
        });
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
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
        expect(
            queryByText(i18n.t('createCommunity.baseIntervalRequired'))
        ).not.toBeNull();
        expect(
            queryByText(
                i18n.t('createCommunity.incrementalIntervalUnitRequired')
            )
        ).not.toBeNull();
    });

    test('try to submit only email', async () => {
        const { getByText, queryByText, getByLabelText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
        expect(
            queryByText(i18n.t('createCommunity.baseIntervalRequired'))
        ).not.toBeNull();
        expect(
            queryByText(
                i18n.t('createCommunity.incrementalIntervalUnitRequired')
            )
        ).not.toBeNull();
    });

    test('try to submit invalid email', async () => {
        const { getByText, queryByText, getByLabelText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

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
        const { getByText, queryByText, getByLabelText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

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

        const { getByText, queryByText, getByLabelText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

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
        const { getByText, queryByText, getByLabelText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
        expect(
            queryByText(i18n.t('createCommunity.baseIntervalRequired'))
        ).not.toBeNull();
        expect(
            queryByText(
                i18n.t('createCommunity.incrementalIntervalUnitRequired')
            )
        ).not.toBeNull();
    });

    test('try to submit only max claim', async () => {
        const { getByText, queryByText, getByLabelText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
        expect(
            queryByText(i18n.t('createCommunity.baseIntervalRequired'))
        ).not.toBeNull();
        expect(
            queryByText(
                i18n.t('createCommunity.incrementalIntervalUnitRequired')
            )
        ).not.toBeNull();
    });

    test('try to submit only increment interval', async () => {
        const { getByText, queryByText, getByLabelText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
        expect(
            queryByText(i18n.t('createCommunity.baseIntervalRequired'))
        ).not.toBeNull();
        expect(
            queryByText(
                i18n.t('createCommunity.incrementalIntervalUnitRequired')
            )
        ).not.toBeNull();
    });

    test('try to submit only incremental interval units', async () => {
        const { getByText, queryByText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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

        fireEvent.press(getByTestId('increment-interval-unit'));
        await act(async () =>
            expect(getByText(i18n.t('createCommunity.minutes')))
        );
        fireEvent.press(getByText(i18n.t('createCommunity.minutes')));
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
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
        expect(queryByText(i18n.t('errors.modals.title'))).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.baseIntervalRequired'))
        ).not.toBeNull();
        expect(
            queryByText(
                i18n.t('createCommunity.incrementalIntervalUnitRequired')
            )
        ).toBeNull();
    });

    test('try to submit only base interval', async () => {
        const { getByText, queryByText, getByLabelText, getByTestId } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        expect(
            queryByText(i18n.t('createCommunity.coverImageRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityNameRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityDescriptionRequired'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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

        fireEvent.press(getByLabelText(i18n.t('createCommunity.frequency')));
        await act(async () =>
            expect(getByText(i18n.t('createCommunity.daily')))
        );
        fireEvent.press(getByText(i18n.t('createCommunity.daily')));
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
            queryByText(i18n.t('createCommunity.cityCountryRequired'))
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
        expect(queryByText(i18n.t('errors.modals.title'))).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.baseIntervalRequired'))
        ).toBeNull();
        expect(
            queryByText(
                i18n.t('createCommunity.incrementalIntervalUnitRequired')
            )
        ).not.toBeNull();
    });

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
        fireEvent.press(getByTestId('create-community-button'));

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
                setTimeout(() => {
                    resolve({
                        data: communityDummyData,
                        error: undefined,
                    });
                }, 5000);
            });
        });

        const {
            getByLabelText,
            getByTestId,
            getByText,
            getByPlaceholderText,
            queryByText,
        } = render(<WrappedCreateCommunityScreen />);
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

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

        fireEvent.changeText(getByLabelText(i18n.t('generic.cityCountry')), '');
        fireEvent.changeText(
            getByPlaceholderText(i18n.t('generic.search')),
            'Beja, Portugal'
        );

        await act(async () => fireEvent.press(getByTestId('select-place')));

        await act(async () => {
            const req = mockAxios.getReqByMatchUrl(/maps\.googleapis\.com/gm);
            mockAxios.mockResponse(
                {
                    data: {
                        result: {
                            geometry: { location: { lat: 1, lng: 1 } },
                            address_components: [
                                { short_name: 'PT', types: ['country'] },
                            ],
                        },
                    },
                },
                req
            );
        });
        fireEvent.press(getByText(i18n.t('generic.submit')));

        fireEvent.press(getByLabelText(i18n.t('createCommunity.frequency')));
        await act(async () =>
            expect(getByText(i18n.t('createCommunity.daily')))
        );
        fireEvent.press(getByText(i18n.t('createCommunity.daily')));

        fireEvent.press(getByTestId('increment-interval-unit'));
        await act(async () =>
            expect(getByText(i18n.t('createCommunity.minutes')))
        );
        fireEvent.press(getByText(i18n.t('createCommunity.minutes')));

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

        expect(
            queryByText(i18n.t('createCommunity.communityRequestError'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityRequestSending'))
        ).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityRequestSuccess'))
        ).toBeNull();
    });

    test('failed submit (cover)', async () => {
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

        communityUploadCoverMock.mockClear();
        communityUploadCoverMock.mockImplementationOnce(() =>
            Promise.resolve(false)
        );

        const {
            getByLabelText,
            getByTestId,
            getByText,
            getByPlaceholderText,
            queryByText,
            queryByTestId,
        } = render(<WrappedCreateCommunityScreen />);
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

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

        fireEvent.changeText(getByLabelText(i18n.t('generic.cityCountry')), '');
        fireEvent.changeText(
            getByPlaceholderText(i18n.t('generic.search')),
            'Beja, Portugal'
        );

        await act(async () => fireEvent.press(getByTestId('select-place')));

        await act(async () => {
            const req = mockAxios.getReqByMatchUrl(/maps\.googleapis\.com/gm);
            mockAxios.mockResponse(
                {
                    data: {
                        result: {
                            geometry: { location: { lat: 1, lng: 1 } },
                            address_components: [
                                { short_name: 'PT', types: ['country'] },
                            ],
                        },
                    },
                },
                req
            );
        });
        fireEvent.press(getByText(i18n.t('generic.submit')));

        fireEvent.press(getByLabelText(i18n.t('createCommunity.frequency')));
        await act(async () =>
            expect(getByText(i18n.t('createCommunity.daily')))
        );
        fireEvent.press(getByText(i18n.t('createCommunity.daily')));

        fireEvent.press(getByTestId('increment-interval-unit'));
        await act(async () =>
            expect(getByText(i18n.t('createCommunity.minutes')))
        );
        fireEvent.press(getByText(i18n.t('createCommunity.minutes')));

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

        expect(queryByTestId('community-request-failed')).not.toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityRequestSending'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityRequestSuccess'))
        ).toBeNull();
    });

    // TODO: failed submit (profile)

    // TODO: failed submit (community)

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

        communityUploadCoverMock.mockClear();
        communityUploadCoverMock.mockImplementation(() =>
            Promise.resolve(true)
        );
        communityCreateMock.mockImplementationOnce(() =>
            Promise.resolve({
                data: communityDummyData,
                error: undefined,
            })
        );

        const {
            getByLabelText,
            getByTestId,
            getByText,
            getByPlaceholderText,
            queryByText,
            queryByTestId,
        } = render(<WrappedCreateCommunityScreen />);
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

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

        fireEvent.changeText(getByLabelText(i18n.t('generic.cityCountry')), '');
        fireEvent.changeText(
            getByPlaceholderText(i18n.t('generic.search')),
            'Beja, Portugal'
        );

        await act(async () => fireEvent.press(getByTestId('select-place')));

        await act(async () => {
            const req = mockAxios.getReqByMatchUrl(/maps\.googleapis\.com/gm);
            mockAxios.mockResponse(
                {
                    data: {
                        result: {
                            geometry: { location: { lat: 1, lng: 1 } },
                            address_components: [
                                { short_name: 'PT', types: ['country'] },
                            ],
                        },
                    },
                },
                req
            );
        });
        fireEvent.press(getByText(i18n.t('generic.submit')));

        fireEvent.changeText(
            getByLabelText(i18n.t('generic.email')),
            'me@example.io'
        );

        fireEvent.press(getByLabelText(i18n.t('createCommunity.frequency')));
        await act(async () =>
            expect(getByText(i18n.t('createCommunity.daily')))
        );
        fireEvent.press(getByText(i18n.t('createCommunity.daily')));

        fireEvent.press(getByTestId('increment-interval-unit'));
        await act(async () =>
            expect(getByText(i18n.t('createCommunity.minutes')))
        );
        fireEvent.press(getByText(i18n.t('createCommunity.minutes')));

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

        expect(queryByTestId('community-request-failed')).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityRequestSending'))
        ).toBeNull();
        expect(
            queryByText(i18n.t('createCommunity.communityRequestSuccess'))
        ).not.toBeNull();
    });

    // TODO: cancel during image upload

    // TODO: cancel during community upload

    // TODO: test without mocking user profile picture

    test('leaving form with half filled, return and recover', async () => {
        const { getByLabelText, getByTestId, getByText, queryByText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.communityName')),
            'test community'
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.shortDescription')),
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacus ex, sagittis eget odio nec, scelerisque maximus nibh. Proin sit amet est ac dolor eleifend sodales. Etiam dolor lacus, blandit sit amet commodo sit amet, vulputate non mi.'
        );

        await act(async () => fireEvent.press(getByTestId('back-button')));

        expect(
            queryByText(i18n.t('createCommunity.leave.message'))
        ).not.toBeNull();

        await act(async () => fireEvent.press(getByText(i18n.t('generic.ok'))));

        await act(async () =>
            fireEvent.press(getByTestId('create-community-button'))
        );

        expect(
            queryByText(i18n.t('createCommunity.recoverForm.message'))
        ).not.toBeNull();

        await act(async () =>
            fireEvent.press(getByText(i18n.t('generic.yes')))
        );

        expect(
            getByLabelText(i18n.t('createCommunity.communityName')).props.value
        ).toEqual('test community');
    });

    test('leaving form with half filled, return and discarding', async () => {
        const { getByLabelText, getByTestId, getByText, queryByText } = render(
            <WrappedCreateCommunityScreen />
        );
        await act(async () => {});
        fireEvent.press(getByTestId('create-community-button'));

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.communityName')),
            'test community'
        );

        fireEvent.changeText(
            getByLabelText(i18n.t('createCommunity.shortDescription')),
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacus ex, sagittis eget odio nec, scelerisque maximus nibh. Proin sit amet est ac dolor eleifend sodales. Etiam dolor lacus, blandit sit amet commodo sit amet, vulputate non mi.'
        );

        await act(async () => fireEvent.press(getByTestId('back-button')));

        expect(
            queryByText(i18n.t('createCommunity.leave.message'))
        ).not.toBeNull();

        await act(async () => fireEvent.press(getByText(i18n.t('generic.ok'))));

        await act(async () =>
            fireEvent.press(getByTestId('create-community-button'))
        );

        expect(
            queryByText(i18n.t('createCommunity.recoverForm.message'))
        ).not.toBeNull();

        await act(async () => fireEvent.press(getByText(i18n.t('generic.no'))));

        expect(
            getByLabelText(i18n.t('createCommunity.communityName')).props.value
        ).toEqual('');
    });
});
