import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import BackSvg from 'components/svg/header/BackSvg';
import { isOutOfTime } from 'helpers/index';
import { findCommunityByIdRequest } from 'helpers/redux/actions/communities';
import { IRootState } from 'helpers/types/state';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Divider, IconButton, Paragraph, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';

import ScanQR from './ScanQR';

function AddManagerScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const communityContract = useSelector(
        (state: IRootState) => state.user.community.contract
    );
    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );
    const userBalance = useSelector(
        (state: IRootState) => state.user.wallet.balance
    );
    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
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

        if (userBalance.length < 16) {
            Alert.alert(
                i18n.t('generic.failure'),
                i18n.t('errors.notEnoughForTransaction'),
                [{ text: i18n.t('generic.close') }],
                { cancelable: false }
            );
            return;
        }

        try {
            addressToAdd = kit.web3.utils.toChecksumAddress(inputAddress);
        } catch (e) {
            Alert.alert(
                i18n.t('generic.failure'),
                i18n.t('manager.addingInvalidAddress'),
                [{ text: i18n.t('generic.close') }],
                { cancelable: false }
            );
            return;
        }

        const searchResult = await Api.community.searchManager(addressToAdd);
        if (searchResult.length !== 0) {
            Alert.alert(
                i18n.t('generic.failure'),
                i18n.t('manager.alreadyInCommunity'),
                [{ text: i18n.t('generic.close') }],
                { cancelable: false }
            );
            return;
        }

        setAddInProgress(true);

        const userExists = await Api.user.exists(addressToAdd);
        if (!userExists) {
            Alert.alert(
                i18n.t('generic.failure'),
                i18n.t('manager.notAnUser'),
                [{ text: i18n.t('generic.close') }],
                { cancelable: false }
            );
            setAddInProgress(false);
            return;
        }

        celoWalletRequest(
            userAddress,
            communityContract.options.address,
            await communityContract.methods.addManager(addressToAdd),
            'addmanager',
            kit
        )
            .then((tx) => {
                if (tx === undefined) {
                    return;
                }
                // refresh community details
                setTimeout(() => {
                    dispatch(findCommunityByIdRequest(community.id));
                }, 2500);

                Alert.alert(
                    i18n.t('generic.success'),
                    i18n.t('manager.addedNewManager'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                navigation.goBack();
            })
            .catch(async (e) => {
                let error = 'errors.unknown';
                if (e.message.includes('has been reverted')) {
                    error = 'errors.sync.issues';
                } else if (
                    e.message.includes('nonce') ||
                    e.message.includes('gasprice is less')
                ) {
                    error = 'errors.sync.possiblyValora';
                } else if (e.message.includes('gas required exceeds')) {
                    error = 'errors.unknown';
                    // verify clock time
                    if (await isOutOfTime()) {
                        error = 'errors.sync.clock';
                    }
                } else if (e.message.includes('Invalid JSON RPC response:')) {
                    if (
                        e.message.includes('The network connection was lost.')
                    ) {
                        error = 'errors.network.connectionLost';
                    }
                    error = 'errors.network.rpc';
                }
                if (error === 'errors.unknown') {
                    //only submit to sentry if it's unknown
                    Sentry.Native.captureException(e);
                }
                Alert.alert(
                    i18n.t('generic.failure'),
                    i18n.t('manager.errorAddingManager', {
                        error: i18n.t(error),
                    }),
                    [{ text: i18n.t('generic.close') }],
                    { cancelable: false }
                );
            })
            .finally(() => {
                setAddInProgress(false);
            });
    };

    const personalAddressWarningMessageCondition =
        inputAddress.toLowerCase() === userAddress.toLowerCase();

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
                        {i18n.t('manager.alreadyInCommunity')}
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
                        label={i18n.t('manager.managerAddress')}
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
                        personalAddressWarningMessageCondition ||
                        // usedAddressWarningMessageCondition ||
                        inputAddress.length === 0
                    }
                    loading={addInProgress === true}
                    onPress={() => handleModalScanQR()}
                >
                    {i18n.t('manager.addManager')}
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
AddManagerScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('manager.addManager'),
    };
};

export default AddManagerScreen;
