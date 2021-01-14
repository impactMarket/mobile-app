import i18n from 'assets/i18n';
import ListActionItem from 'components/ListActionItem';
import { amountToCurrency } from 'helpers/currency';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import BackSvg from 'components/svg/header/BackSvg';
import { IRootState } from 'helpers/types/state';
import { IManagersDetails } from 'helpers/types/endpoints';
import { setStateManagersDetails } from 'helpers/redux/actions/views';

function AddedManagerScreen() {
    const dispatch = useDispatch();

    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );
    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );
    const stateManagerDetails = useSelector(
        (state: IRootState) => state.view.managerDetails
    );

    const [managerDetails, setManagerDetails] = useState<
        IManagersDetails | undefined
    >();

    useEffect(() => {
        const loadDetails = () => {
            // it's not correct, I guess
            if (stateManagerDetails !== undefined) {
                setManagerDetails(stateManagerDetails);
            } else {
                Api.community.managersDetails().then((details) => {
                    setManagerDetails(details);
                    dispatch(setStateManagersDetails(details));
                });
            }
        };
        loadDetails();
        return;
    }, [stateManagerDetails]);

    if (managerDetails === undefined) {
        // TODO: loading...
        return null;
    }

    return (
        <ScrollView style={{ marginHorizontal: 15 }}>
            {managerDetails.managers.map((manager) => (
                <ListActionItem
                    key={manager.address}
                    item={{
                        description: i18n.t('managerSince', {
                            date: moment(manager.timestamp).format('MMM, YYYY'),
                        }),
                        from: manager,
                        key: manager.address,
                        timestamp: 0,
                    }}
                />
            ))}
        </ScrollView>
    );
}
AddedManagerScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('added'),
    };
};

export default AddedManagerScreen;
