import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import ListActionItem from 'components/ListActionItem';
import { updateCommunityInfo } from 'helpers/index';
import { amountToCurrency } from 'helpers/currency';
import moment from 'moment';
import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import BackSvg from 'components/svg/header/BackSvg';
import { IRootState } from 'helpers/types/state';

interface IAddedBeneficiaryScreenProps {
    route: {
        params: {
            beneficiaries: ICommunityInfoBeneficiary[];
        };
    };
}
const mapStateToProps = (state: IRootState) => {
    const { user, app } = state;
    return { user, app };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & IAddedBeneficiaryScreenProps;

function AddedBeneficiaryScreen(props: Props) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const beneficiaries = props.route.params
        .beneficiaries as ICommunityInfoBeneficiary[];

    const [removing, setRemoving] = useState(false);

    const handleRemoveBeneficiary = async (beneficiary: string) => {
        const { user } = props;
        const communityContract = user.community.contract;
        const { address } = user.wallet;

        setRemoving(true);
        celoWalletRequest(
            address,
            communityContract.options.address,
            await communityContract.methods.removeBeneficiary(beneficiary),
            'removebeneficiary',
            props.app.kit
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
                updateCommunityInfo(props.user.community.metadata.publicId, dispatch);
            })
            .catch((e) => {
                Api.uploadError(address, 'remove_beneficiary', e);
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

    return (
        <>
            <ScrollView style={{ marginHorizontal: 15 }}>
                {beneficiaries.map((beneficiary) => (
                    <ListActionItem
                        key={beneficiary.address}
                        item={{
                            description: i18n.t('claimedSince', {
                                amount:
                                    beneficiary.claimed === undefined
                                        ? '0'
                                        : amountToCurrency(
                                              beneficiary.claimed,
                                              props.user.metadata.currency,
                                              props.app.exchangeRates
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
        </>
    );
}
AddedBeneficiaryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('added'),
    };
};

export default connector(AddedBeneficiaryScreen);
