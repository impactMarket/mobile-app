import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { act, fireEvent, render } from '@testing-library/react-native';
import i18n from 'assets/i18n';
import combinedReducer from 'helpers/redux/reducers';
import React from 'react';
import { Host } from 'react-native-portalize';
import * as reactRedux from 'react-redux';
import { createStore } from 'redux';

import CreateCommunityScreen from '../create';

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

describe('create community [snapshot]', () => {
    const useSelectorMock = reactRedux.useSelector as jest.Mock<any, any>;

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
                    communityCreationError: null,
                },
            });
        });
    });

    it('renders correctly', async () => {
        const tree = render(<WrappedCreateCommunityScreen />).toJSON();
        await act(async () => {});
        expect(tree).toMatchSnapshot();
    });

    it('renders error messages and error modal', async () => {
        const rendered = render(<WrappedCreateCommunityScreen />);
        const tree = rendered.toJSON();
        await act(async () => {});
        fireEvent.press(rendered.getByText(i18n.t('generic.submit')));
        expect(tree).toMatchSnapshot();
    });

    it('renders error messages without modal', async () => {
        const rendered = render(<WrappedCreateCommunityScreen />);
        const tree = rendered.toJSON();
        await act(async () => {});
        fireEvent.press(rendered.getByText(i18n.t('generic.submit')));
        fireEvent.press(rendered.getByTestId('close-modal'));
        expect(tree).toMatchSnapshot();
    });

    // TODO: test without mocking user profile picture
});
