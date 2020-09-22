import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import { ethers } from 'ethers';
import { updateCommunityInfo, iptcColors } from 'helpers/index';
import { IRootState, ICommunityInfo } from 'helpers/types';
import React, { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { Card, Headline, Button } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { celoWalletRequest } from 'services/celoWallet';

import ModalScanQR from '../../../../common/ModalScanQR';
import { BigNumber } from 'bignumber.js';

interface IBeneficiariesProps {
    community: ICommunityInfo;
    updateCommunity: (community: ICommunityInfo) => void;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network, app } = state;
    return { user, network, app };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & IBeneficiariesProps;

function Beneficiaries(props: Props) {
    const navigation = useNavigation();
    const [openModalAddBeneficiary, setOpenModalAddBeneficiary] = useState(
        false
    );
    const [addInProgress, setAddInProgress] = useState(false);
    const [hasFundsToNewBeneficiary, setHasFundsToNewBeneficiary] = useState(
        true
    );

    // TODO: add here a method to be called when page is refreshed

    useEffect(() => {
        const loadCommunityBalance = async () => {
            if (props.app.kit.contracts !== undefined) {
                const stableToken = await props.app.kit.contracts.getStableToken();
                const cUSDBalanceBig = await stableToken.balanceOf(
                    props.network.contracts.communityContract._address
                );
                // at least five cents
                setHasFundsToNewBeneficiary(
                    new BigNumber(cUSDBalanceBig.toString()).gte(
                        '50000000000000000'
                    )
                );
            }
        };
        loadCommunityBalance();
    }, [props.app.kit]);

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
                i18n.t('addingInvalidAddress'),
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
            props.app.kit
        )
            .then(() => {
                setTimeout(
                    () =>
                        updateCommunityInfo(props.user.celoInfo.address, props),
                    10000
                );

                Alert.alert(
                    i18n.t('success'),
                    i18n.t('addedNewBeneficiary'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                setOpenModalAddBeneficiary(false);
            })
            .catch(() => {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorAddingBeneficiary'),
                    [{ text: i18n.t('close') }],
                    { cancelable: false }
                );
            })
            .finally(() => {
                setAddInProgress(false);
            });
    };

    return (
        <View>
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
                        disabled={
                            props.community.beneficiaries.added.length === 0
                        }
                        style={{ marginVertical: 5 }}
                        onPress={() =>
                            navigation.navigate('AddedScreen', {
                                beneficiaries:
                                    props.community.beneficiaries.added,
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
                    <View>
                        {hasFundsToNewBeneficiary ? (
                            <Button
                                mode="contained"
                                style={{
                                    marginVertical: 5,
                                    backgroundColor: iptcColors.greenishTeal,
                                    position: 'relative',
                                }}
                                onPress={() => setOpenModalAddBeneficiary(true)}
                            >
                                {i18n.t('addBeneficiary')}
                            </Button>
                        ) : (
                            <Button
                                icon="alert"
                                mode="contained"
                                style={{
                                    marginVertical: 5,
                                    backgroundColor: '#f0ad4e',
                                }}
                                onPress={() => {
                                    Alert.alert(
                                        i18n.t('noFunds'),
                                        i18n.t('notFundsToAddBeneficiary'),
                                        [{ text: i18n.t('close') }],
                                        { cancelable: false }
                                    );
                                }}
                            >
                                {i18n.t('addBeneficiary')}
                            </Button>
                        )}
                    </View>
                </Card.Content>
            </Card>
            <ModalScanQR
                isVisible={openModalAddBeneficiary}
                openInCamera={false}
                onDismiss={() => setOpenModalAddBeneficiary(false)}
                inputText={i18n.t('beneficiaryAddress')}
                selectButtonText={i18n.t('add')}
                selectButtonInProgress={addInProgress}
                callback={handleModalScanQR}
            />
        </View>
    );
}

export default connector(Beneficiaries);
