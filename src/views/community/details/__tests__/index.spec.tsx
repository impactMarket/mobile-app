import { assert } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import CommunityDetailsScreen from '../index';

const mockStore = configureMockStore();
const store = mockStore({});

describe('Community Details screen test suite', () => {
    let screen: ShallowWrapper<any>;

    let route: {
        params: {
            communityId: 2;
            openDonate?: true;
            fromStories?: false;
        };
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render CommunityDetails screen correctly', () => {
        givenScreen();
        thenItRenderProperly();
    });

    function givenScreen() {
        assert.isDefined(CommunityDetailsScreen);

        screen = shallow(
            <Provider store={store}>
                <CommunityDetailsScreen route={route} />
            </Provider>
        );
    }

    function thenItRenderProperly() {
        expect(screen).toMatchSnapshot();
    }
});
