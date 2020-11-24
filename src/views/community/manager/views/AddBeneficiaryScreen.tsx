import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import BackSvg from 'components/svg/header/BackSvg';
import { ethers } from 'ethers';
import { updateCommunityInfo } from 'helpers/index';
import { IRootState } from 'helpers/types';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Divider, IconButton, Paragraph, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { celoWalletRequest } from 'services/celoWallet';
import ScanQR from './ScanQR';

function AddBeneficiaryScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const communityContract = useSelector(
        (state: IRootState) => state.network.contracts.communityContract
    );
    const userAddress = useSelector(
        (state: IRootState) => state.user.celoInfo.address
    );
    const community = useSelector(
        (state: IRootState) => state.network.community
    );
    const kit = useSelector((state: IRootState) => state.app.kit);

    const [inputAddress, setInputAddress] = useState('');
    const [usingCamera, setUsingCamera] = useState(false);
    const [addInProgress, setAddInProgress] = useState(false);

    const handleModalScanQR = async () => {
        let addressToAdd: string;

        if (communityContract === undefined) {
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
            userAddress,
            communityContract.options.address,
            await communityContract.methods.addBeneficiary(addressToAdd),
            'addbeneficiary',
            kit
        )
            .then((tx) => {
                if (tx === undefined) {
                    return;
                }
                setTimeout(
                    () => updateCommunityInfo(community.publicId, dispatch),
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
        inputAddress.toLowerCase() === userAddress.toLowerCase();
    const usedAddressWarningMessageCondition =
        community.beneficiaries.added.find(
            (b) => b.address.toLowerCase() === inputAddress.toLowerCase()
        ) !== undefined;

    return (
        <>
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
AddBeneficiaryScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('addBeneficiary'),
    };
};

export default AddBeneficiaryScreen;
