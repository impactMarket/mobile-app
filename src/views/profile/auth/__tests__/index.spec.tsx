import React from 'react';
import renderer from 'react-test-renderer';

import Auth from '../index';

test('renders correctly', () => {
    const screen = renderer.create(<Auth />).toJSON();
    expect(screen).toMatchSnapshot();
});
