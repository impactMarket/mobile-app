import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import { ethers } from 'ethers';
import { updateCommunityInfo, iptcColors } from 'helpers/index';
import { IRootState, ICommunityInfo } from 'helpers/types';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Card, Headline, Button } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { celoWalletRequest } from 'services/celoWallet';

import ModalScanQR from '../../../../common/ModalScanQR';

interface IBeneficiariesProps {
    community: ICommunityInfo;
    updateCommunity: (community: ICommunityInfo) => void;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state;
    return { user, network };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & IBeneficiariesProps;

function Beneficiaries(props: Props) {
    const navigation = useNavigation();
    const [addInProgress, setAddInProgress] = useState(false);

    const handleModalScanQR = async (inputAddress: string) => {
        const { user, network } = props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;
        let addressToAdd: string;

        if (communityContract === undefined) {
            // TODO: do something beatiful, la la la
            return;
        }

        try {
            addressToAdd = ethers.utils.getAddress(inputAddress);
        } catch (e) {
            Alert.alert(
                i18n.t('failure'),
                'You are trying to add an invalid address!',
                [{ text: i18n.t('close') }],
                { cancelable: false }
            );
            return;
        }

        setAddInProgress(true);
        celoWalletRequest(
            address,
            communityContract.options.address,
            await communityContract.methods.addBeneficiary(addressToAdd),
            'addbeneficiary',
            network
        )
            .then(() => {
                // TODO: update UI
                setTimeout(
                    () =>
                        updateCommunityInfo(props.user.celoInfo.address, props),
                    10000
                );

                Alert.alert(
                    i18n.t('success'),
                    "You've successfully added a new beneficiary!",
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            })
            .catch(() => {
                Alert.alert(
                    i18n.t('failure'),
                    'An error happened while adding the request!',
                    [{ text: i18n.t('close') }],
                    { cancelable: false }
                );
            })
            .finally(() => {
                setAddInProgress(false);
            });
    };

    return (
        <Card elevation={8}>
            <Card.Content>
                <Headline
                    style={{
                        opacity: 0.48,
                        fontFamily: 'Gelion-Bold',
                        fontSize: 13,
                        fontWeight: '500',
                        fontStyle: 'normal',
                        lineHeight: 12,
                        letterSpacing: 0.7,
                    }}
                >
                    {i18n.t('beneficiaries').toUpperCase()}
                </Headline>
                <Button
                    mode="outlined"
                    disabled={props.community.beneficiaries.added.length === 0}
                    style={{ marginVertical: 5 }}
                    onPress={() =>
                        navigation.navigate('AddedScreen', {
                            beneficiaries: props.community.beneficiaries.added,
                        })
                    }
                >
                    {i18n.t('added')} (
                    {props.community.beneficiaries.added.length})
                </Button>
                <Button
                    mode="outlined"
                    disabled={
                        props.community.beneficiaries.removed.length === 0
                    }
                    style={{ marginVertical: 5 }}
                    onPress={() =>
                        navigation.navigate('RemovedScreen', {
                            beneficiaries:
                                props.community.beneficiaries.removed,
                        })
                    }
                >
                    {i18n.t('removed')} (
                    {props.community.beneficiaries.removed.length})
                </Button>
                <ModalScanQR
                    buttonStyle={{
                        marginVertical: 5,
                        backgroundColor: iptcColors.greenishTeal,
                    }}
                    buttonText={i18n.t('addBeneficiary')}
                    inputText={i18n.t('beneficiaryAddress')}
                    selectButtonText={i18n.t('add')}
                    callback={handleModalScanQR}
                />
            </Card.Content>
        </Card>
    );
}

export default connector(Beneficiaries);
