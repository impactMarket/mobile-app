import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import ListActionItem from 'components/ListActionItem';
import { updateCommunityInfo } from 'helpers/index';
import { amountToCurrency } from 'helpers/currency';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import BackSvg from 'components/svg/header/BackSvg';
import { IRootState } from 'helpers/types/state';
import { IManagersDetails } from 'helpers/types/endpoints';
import { setStateManagersDetails } from 'helpers/redux/actions/views';

function AddedBeneficiaryScreen() {
    const navigation = useNavigation();
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

    const [removing, setRemoving] = useState(false);
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

    const handleRemoveBeneficiary = async (beneficiary: string) => {
        const communityContract = community.contract;

        setRemoving(true);
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
                navigation.goBack();
                // TODO: update after going back
                updateCommunityInfo(community.metadata.publicId, dispatch);
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
                setRemoving(false);
            });
    };

    if (managerDetails === undefined) {
        // TODO: loading...
        return null;
    }

    return (
        <ScrollView style={{ marginHorizontal: 15 }}>
            {managerDetails.beneficiaries.active.map((beneficiary) => (
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
                        disabled={removing}
                        loading={removing}
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            handleRemoveBeneficiary(beneficiary.address)
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
