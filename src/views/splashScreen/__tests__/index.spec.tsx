import React from 'react';
import { create } from 'react-test-renderer';

import SplashScreen from '../index';

const tree = create(<SplashScreen />).toJSON();

describe('Splash screen test', () => {
    test('should render SplashScreen correctly', () => {
        expect(tree).toMatchSnapshot();
    });
});
