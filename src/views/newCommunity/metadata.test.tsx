import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { render, fireEvent, cleanup, act } from '@testing-library/react-native';
import i18n from 'assets/i18n';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Host } from 'react-native-portalize';
import * as reactRedux from 'react-redux';

import CreateCommunityScreen from './index';

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

test('create community - metadata', async () => {
    const useSelectorMock = reactRedux.useSelector as jest.Mock<any, any>;
    const launchImageLibraryAsyncMock = ImagePicker.launchImageLibraryAsync as jest.Mock<
        any,
        any
    >;

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
    }); // mockReturnValueOnce('USD');
    launchImageLibraryAsyncMock.mockReturnValueOnce(
        Promise.resolve({
            uri: '/some/fake/image/uri.jpg',
            width: 790,
            height: 790,
            type: 'image',
            cancelled: false,
        })
    );

    const { getByLabelText, getByText } = render(<FakeCreateCommunityScreen />);
    await act(async () => {});

    const communityName = getByLabelText(i18n.t('communityName'));
    fireEvent.changeText(communityName, 'test community');

    fireEvent.press(getByLabelText('image uploader'));

    fireEvent.press(getByLabelText(i18n.t('country')));
    // TODO: scroll to another country
    await act(async () => expect(getByLabelText('AR')));
    fireEvent.press(getByLabelText('AR'));

    fireEvent.press(getByText(i18n.t('submit')));
});
