import { render } from '@testing-library/react-native';
import React from 'react';

import Welcome from '../index';

describe('Welcome screen test', () => {
    test('should render WelcomeScreen correctly', () => {
        const tree = render(<Welcome />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('should render welcomeBtnContainer correctly', () => {
        const { queryByTestId } = render(<Welcome />);
        expect(queryByTestId('welcomeBtnContainer')).not.toBeNull();
    });
});
