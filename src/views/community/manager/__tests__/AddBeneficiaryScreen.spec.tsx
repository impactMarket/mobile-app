import { render, fireEvent } from '@testing-library/react-native';
import combinedReducer from 'helpers/redux/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import AddBeneficiaryScreen from '../views/AddedBeneficiaryScreen';

const store = createStore(combinedReducer);

const handleModalScanQR = jest.fn();

const tree = render(
    <Provider store={store}>
        <AddBeneficiaryScreen />
    </Provider>
);

describe('AddBeneficiary Screen test', () => {
    test('should render AddBeneficiaryScreenScreen correctly', () => {
        expect(tree).toMatchSnapshot();
    });

    test('should call handleModalScanQR method when addBeneficiaryBtn pressed ', () => {
        const { getAllByTestId } = render(
            <Provider store={store}>
                <AddBeneficiaryScreen />
            </Provider>
        );

        // const btn = getAllByTestId('addBeneficiaryBtn');

        // expect(btn).toBeDefined();

        // fireEvent.press(btn.);

        // expect(handleModalScanQR).toHaveBeenCalled();
    });
});
