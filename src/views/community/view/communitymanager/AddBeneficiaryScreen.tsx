import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/Button';
import Header from 'components/Header';
import ValidatedTextInput from 'components/ValidatedTextInput';
import { ethers } from 'ethers';
import { iptcColors } from 'helpers/index';
import { IStoreCombinedState, IStoreCombinedActionsTypes } from 'helpers/types';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import {
    // Button,
    Divider,
    IconButton,
    Paragraph,
    Portal,
    TextInput,
    Text,
} from 'react-native-paper';
import { useStore } from 'react-redux';
import { celoWalletRequest } from 'services/celoWallet';
import ScanQR from '../../../common/ScanQR';

function AddBeneficiaryScreen() {
    const store = useStore<IStoreCombinedState, IStoreCombinedActionsTypes>();
    const navigation = useNavigation();
    const { user, network, app } = store.getState();

    const [inputAddress, setInputAddress] = useState('');
    const [usingCamera, setUsingCamera] = useState(false);
    const [addInProgress, setAddInProgress] = useState(false);

    const handleModalScanQR = async () => {
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
            app.kit
        )
            .then(() => {
                setTimeout(
                    () =>
                        // updateCommunityInfo(user.celoInfo.address, props),
                        10000
                );

                Alert.alert(
                    i18n.t('success'),
                    i18n.t('addedNewBeneficiary'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                navigation.goBack();
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

    const personalAddressWarningMessageCondition =
        inputAddress.toLowerCase() === user.celoInfo.address.toLowerCase();
    const usedAddressWarningMessageCondition =
        network.community.beneficiaries.added.find(
            (b) => b.address.toLowerCase() === inputAddress.toLowerCase()
        ) !== undefined;

    return (
        <>
            <Header
                title={i18n.t('addBeneficiary')}
                hasBack
                navigation={navigation}
            />
            {personalAddressWarningMessageCondition && (
                <View
                    style={{ alignItems: 'center', paddingHorizontal: '20%' }}
                >
                    <IconButton icon="alert" color="#f0ad4e" size={20} />
                    <Paragraph
                        style={{
                            marginHorizontal: 10,
                            textAlign: 'center',
                        }}
                    >
                        {i18n.t('addingYourOwnAddress')}
                    </Paragraph>
                </View>
            )}
            {usedAddressWarningMessageCondition && (
                <View
                    style={{ alignItems: 'center', paddingHorizontal: '20%' }}
                >
                    <IconButton icon="alert" color="#f0ad4e" size={20} />
                    <Paragraph
                        style={{
                            marginHorizontal: 10,
                            textAlign: 'center',
                        }}
                    >
                        {i18n.t('alreadyInCommunity')}
                    </Paragraph>
                </View>
            )}
            <View style={{ flex: 1, marginHorizontal: 10, marginTop: 20 }}>
                <Divider />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // width: '100%',
                        paddingHorizontal: 20,
                    }}
                >
                    <TextInput
                        mode="flat"
                        underlineColor="transparent"
                        style={{
                            width: '80%',
                            fontFamily: 'Gelion-Regular',
                            backgroundColor: 'transparent',
                            paddingHorizontal: 0,
                        }}
                        label={i18n.t('beneficiaryAddress')}
                        value={inputAddress}
                        // required
                        onChangeText={(value: string) => setInputAddress(value)}
                    />
                    <IconButton
                        style={{
                            alignSelf: 'center',
                            width: '20%',
                            right: -15,
                        }}
                        icon="qrcode"
                        size={20}
                        onPress={() => setUsingCamera(true)}
                    />
                </View>
                <Divider />
                <Button
                    modeType="green"
                    style={{
                        marginVertical: 10,
                        marginHorizontal: 20,
                    }}
                    disabled={
                        usedAddressWarningMessageCondition ||
                        inputAddress.length === 0
                        // (selectButtonInProgress !== undefined &&
                        //     selectButtonInProgress === true)
                    }
                    loading={addInProgress === true}
                    onPress={() => handleModalScanQR()}
                >
                    {i18n.t('addBeneficiary')}
                </Button>
            </View>
            <ScanQR
                isVisible={usingCamera}
                onDismiss={() => setUsingCamera(false)}
                callback={(value) => setInputAddress(value)}
            />
        </>
    );
}

export default AddBeneficiaryScreen;
