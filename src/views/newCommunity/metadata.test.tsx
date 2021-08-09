import { render, fireEvent, cleanup } from '@testing-library/react-native';
import i18n from 'assets/i18n';
import React from 'react';
import { Host } from 'react-native-portalize';

import CreateCommunityScreen from './index';

afterEach(cleanup);

test('create community - metadata', () => {
    const { getByLabelText } = render(
        <Host>
            <CreateCommunityScreen />
        </Host>
    );

    const communityName = getByLabelText(i18n.t('communityName'));

    fireEvent.changeText(communityName, 'test community');

    // fireEvent.press(getByText(i18n.t('submit')));
});
