import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Header from 'components/Header';
import ListActionItem from 'components/ListActionItem';
import {
    amountToUserCurrency,
    getUserCurrencySymbol,
    updateCommunityInfo,
} from 'helpers/index';
import { IRootState, ICommunityInfoBeneficiary } from 'helpers/types';
import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { celoWalletRequest } from 'services/celoWallet';

interface IAddedScreenProps {
    route: {
        params: {
            beneficiaries: ICommunityInfoBeneficiary[];
        };
    };
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state;
    return { user, network };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & IAddedScreenProps;

function AddedScreen(props: Props) {
    const navigation = useNavigation();
    const beneficiaries = props.route.params
        .beneficiaries as ICommunityInfoBeneficiary[];

    const [removing, setRemoving] = useState(false);

    const handleRemoveBeneficiary = async (beneficiary: string) => {
        const { user, network } = props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;

        setRemoving(true);
        celoWalletRequest(
            address,
            communityContract.options.address,
            await communityContract.methods.removeBeneficiary(beneficiary),
            'removebeneficiary',
            network
        )
            .then(() => {
                Alert.alert(
                    i18n.t('success'),
                    i18n.t('beneficiaryWasRemoved', { beneficiary }),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                navigation.goBack();
                // TODO: update after going back
                updateCommunityInfo(props.user.celoInfo.address, props);
            })
            .catch((e) => {
                // TODO: register error to log system
                Alert.alert(
                    i18n.t('success'),
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
            <Header
                title={i18n.t('added')}
                hasHelp
                hasBack
                navigation={navigation}
            />
            <ScrollView style={{ marginHorizontal: 15 }}>
                {beneficiaries.map((beneficiary) => (
                    <ListActionItem
                        key={beneficiary.address}
                        item={{
                            description: `${getUserCurrencySymbol(
                                props.user.user
                            )}${
                                beneficiary.claimed === undefined
                                    ? '0'
                                    : amountToUserCurrency(
                                          beneficiary.claimed,
                                          props.user.user
                                      )
                            }`,
                            from:
                                beneficiary.name === null
                                    ? beneficiary.address
                                    : beneficiary.name,
                            key: beneficiary.address,
                            timestamp: 0,
                        }}
                    >
                        <Button
                            mode="outlined"
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

export default connector(AddedScreen);
