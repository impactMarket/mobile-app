import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import { amountToCurrency } from 'helpers/currency';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Alert,
    View,
    FlatList,
    RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import BackSvg from 'components/svg/header/BackSvg';
import { IRootState } from 'helpers/types/state';
import {
    IManagerDetailsBeneficiary,
    IManagersDetails,
} from 'helpers/types/endpoints';
import { setStateManagersDetails } from 'helpers/redux/actions/views';
import { ActivityIndicator, List } from 'react-native-paper';
import { iptcColors } from 'styles/index';
import { decrypt } from 'helpers/encryption';

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
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        Api.community
            .managersDetails()
            .then((details) => {
                setManagerDetails(details);
                dispatch(setStateManagersDetails(details));
            })
            .finally(() => setRefreshing(false));
    }, []);

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
                Api.system.uploadError(userWallet.address, 'remove_beneficiary', e);
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

    const formatAddressOrName = (from: IManagerDetailsBeneficiary) => {
        let titleMaxLength = 25;
        const fromHasName = from.username !== null && from.username.length > 0;
        let name = '';
        if (from.username !== null && fromHasName) {
            name = decrypt(from.username);
        }

        return fromHasName
            ? name
            : `${from.address.slice(
                  0,
                  (titleMaxLength - 4) / 2
              )}..${from.address.slice(42 - (titleMaxLength - 4) / 2, 42)}`;
    };

    return (
        <FlatList
            data={managerDetails.beneficiaries.active}
            style={{ paddingHorizontal: 15 }}
            renderItem={({
                item,
                index,
            }: {
                item: IManagerDetailsBeneficiary;
                index: number;
            }) => (
                <List.Item
                    title={formatAddressOrName(item)}
                    description={i18n.t('claimedSince', {
                        amount:
                            item.claimed === undefined
                                ? '0'
                                : amountToCurrency(
                                      item.claimed,
                                      userCurrency,
                                      exchangeRates
                                  ),
                        date: moment(item.timestamp).format('MMM, YYYY'),
                    })}
                    right={() => (
                        <Button
                            modeType="gray"
                            bold={true}
                            disabled={removing[index]}
                            loading={removing[index]}
                            style={{ marginVertical: 5 }}
                            onPress={() =>
                                handleRemoveBeneficiary(item.address, index)
                            }
                        >
                            {i18n.t('remove')}
                        </Button>
                    )}
                    titleStyle={styles.textTitle}
                    descriptionStyle={styles.textDescription}
                    style={{ paddingLeft: 0 }}
                />
            )}
            keyExtractor={(item) => item.address}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        />
    );
}
AddedBeneficiaryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('added'),
    };
};

const styles = StyleSheet.create({
    textTitle: {
        fontFamily: 'Gelion-Regular',
        fontSize: 20,
        letterSpacing: 0,
    },
    textDescription: {
        fontFamily: 'Gelion-Regular',
        letterSpacing: 0.25,
        color: 'grey',
    },
});

export default AddedBeneficiaryScreen;
