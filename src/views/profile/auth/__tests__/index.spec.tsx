import { NavigationContext } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import combinedReducer from 'helpers/redux/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Auth from '../index';

const store = createStore(combinedReducer);

const setToggleInformativeModal = jest.fn();
jest.mock('setToggleInformativeModal', () => setToggleInformativeModal);

describe('testing useFocusOnEffect in Auth', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe('when the view comes into focus', () => {
        it('calls setToggleInformativeModal', () => {
            const navContextValue = {
                isFocused: () => false,
                addListener: jest.fn(() => jest.fn()),
            };

            render(
                <NavigationContext.Provider value={navContextValue as any}>
                    <Provider store={store}>
                        <Auth />
                    </Provider>
                </NavigationContext.Provider>
            );

            expect(setToggleInformativeModal).toBeCalledTimes(0);

            render(
                <NavigationContext.Provider
                    value={{
                        ...navContextValue,
                        isFocused: () => true,
                    }}
                >
                    <Auth />
                </NavigationContext.Provider>
            );

            expect(setToggleInformativeModal).toBeCalledTimes(1);
        });
    });
});
