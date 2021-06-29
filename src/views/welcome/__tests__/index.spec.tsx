import { useNavigation } from '@react-navigation/core';
import { assert } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import { Screens } from 'helpers/constants';
import { SetAppFromWelcomeScreen } from 'helpers/redux/actions/app';
import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import Welcome from '../index';

const mockStore = configureMockStore();
const store = mockStore({});

describe('Welcome screen test suite', () => {
    let screen: ShallowWrapper<any>;

    const navigate = jest.fn();
    const dispatch = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        (useEffect as jest.Mock).mockImplementation((f: any) => f());
        (useNavigation as jest.Mock).mockReturnValue({ navigate });
        (useDispatch as jest.Mock).mockReturnValue(dispatch);
    });

    it('should render Welcome screen correctly', () => {
        givenScreen();
        thenItRenderProperly();
    });

    it('should navigate to Valora', () => {
        givenScreen();
        thenItRenderProperly();
        whenPressingButton('connectWithValora');
        thenSuccessActionsAreDispatch('Auth');
    });

    it('should navigate to Communities', () => {
        givenScreen();
        thenItRenderProperly();
        whenPressingButton('exploreCommunities');
        thenSuccessActionsAreDispatch('Communities');
    });

    function givenScreen() {
        assert.isDefined(Welcome);

        screen = shallow(
            <Provider store={store}>
                <Welcome />
            </Provider>
        )
            .childAt(0)
            .dive();
    }

    function whenPressingButton(id: string) {
        const btn = screen.find(`[testID="${id}"]`);
        expect(btn).toBeDefined();
        btn.simulate('press');
    }

    function thenSuccessActionsAreDispatch(screen: string) {
        switch (screen) {
            case 'Auth':
                expect(dispatch).toHaveBeenNthCalledWith(
                    1,
                    SetAppFromWelcomeScreen(Screens.Auth)
                );
                break;
            case 'Communities':
                expect(dispatch).toHaveBeenNthCalledWith(
                    1,
                    SetAppFromWelcomeScreen(Screens.Communities)
                );
                break;
        }
    }

    function thenItRenderProperly() {
        expect(screen).toMatchSnapshot();
    }
});
