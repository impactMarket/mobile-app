import i18n from 'assets/i18n';
import ListActionItem from 'components/ListActionItem';
import BackSvg from 'components/svg/header/BackSvg';
import { amountToCurrency } from 'helpers/currency';
import { setStateManagersDetails } from 'helpers/redux/actions/views';
import { IManagersDetails } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { iptcColors } from 'styles/index';
function RemovedBeneficiaryScreen() {
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
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                }}
            >
                <ActivityIndicator
                    animating={true}
                    size="large"
                    color={iptcColors.softBlue}
                />
            </View>
        );
    }

    return (
        <>
            <ScrollView style={{ marginHorizontal: 15 }}>
                {managerDetails.beneficiaries.inactive.map((beneficiary) => (
                    <ListActionItem
                        key={beneficiary.address}
                        item={{
                            description: i18n.t('claimedSince', {
                                amount:
                                    beneficiary.claimed === undefined
                                        ? '0'
                                        : amountToCurrency(
                                              beneficiary.claimed,
                                              userCurrency,
                                              exchangeRates
                                          ),
                                date: moment(beneficiary.timestamp).format(
                                    'MMM, YYYY'
                                ),
                            }),
                            from: beneficiary,
                            key: beneficiary.address,
                            timestamp: 0,
                        }}
                    />
                ))}
            </ScrollView>
        </>
    );
}
RemovedBeneficiaryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('removed'),
    };
};

export default RemovedBeneficiaryScreen;
