import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import ListActionItem from 'components/ListActionItem';
import { amountToCurrency } from 'helpers/currency';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import BackSvg from 'components/svg/header/BackSvg';
import { IRootState } from 'helpers/types/state';
import { IManagersDetails } from 'helpers/types/endpoints';
import { setStateManagersDetails } from 'helpers/redux/actions/views';
import { ActivityIndicator } from 'react-native-paper';
import { iptcColors } from 'styles/index';

function AddedBeneficiaryScreen() {
    const dispatch = useDispatch();

    const community = useSelector((state: IRootState) => state.user.community);
    const userWallet = useSelector((state: IRootState) => state.user.wallet);
    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );
    const kit = useSelector((state: IRootState) => state.app.kit);
    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );
    const stateManagerDetails = useSelector(
        (state: IRootState) => state.view.managerDetails
    );

    const [removing, setRemoving] = useState<boolean[]>();
    const [managerDetails, setManagerDetails] = useState<
        IManagersDetails | undefined
    >();

    useEffect(() => {
        const loadDetails = () => {
            // it's not correct, I guess
            if (stateManagerDetails !== undefined) {
                setRemoving(
                    Array(stateManagerDetails.beneficiaries.active.length).fill(
                        false
                    )
                );
                setManagerDetails(stateManagerDetails);
            } else {
                Api.community.managersDetails().then((details) => {
                    setRemoving(
                        Array(details.beneficiaries.active.length).fill(false)
                    );
                    setManagerDetails(details);
                    dispatch(setStateManagersDetails(details));
                });
            }
        };
        loadDetails();
        return;
    }, [stateManagerDetails]);

    const handleRemoveBeneficiary = async (
        beneficiary: string,
        index: number
    ) => {
        const communityContract = community.contract;

        const newRemoving = removing!;
        newRemoving[index] = true;
        setRemoving(() => [...newRemoving]);
        celoWalletRequest(
            userWallet.address,
            communityContract.options.address,
            await communityContract.methods.removeBeneficiary(beneficiary),
            'removebeneficiary',
            kit
        )
            .then((tx) => {
                if (tx === undefined) {
                    return;
                }
                Alert.alert(
                    i18n.t('success'),
                    i18n.t('beneficiaryWasRemoved', { beneficiary }),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                Api.community.managersDetails().then((details) => {
                    setManagerDetails(details);
                    dispatch(setStateManagersDetails(details));
                });
            })
            .catch((e) => {
                Api.uploadError(userWallet.address, 'remove_beneficiary', e);
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorRemovingBeneficiary'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            })
            .finally(() => {
                const newRemoving = removing!;
                newRemoving[index] = false;
                setRemoving(() => [...newRemoving]);
            });
    };

    if (managerDetails === undefined || removing == undefined) {
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
        <ScrollView style={{ marginHorizontal: 15 }}>
            {managerDetails.beneficiaries.active.map((beneficiary, index) => (
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
                >
                    <Button
                        modeType="gray"
                        bold={true}
                        disabled={removing[index]}
                        loading={removing[index]}
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            handleRemoveBeneficiary(beneficiary.address, index)
                        }
                    >
                        {i18n.t('remove')}
                    </Button>
                </ListActionItem>
            ))}
        </ScrollView>
    );
}
AddedBeneficiaryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('added'),
    };
};

export default AddedBeneficiaryScreen;
