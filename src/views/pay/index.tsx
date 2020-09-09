import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import Header from 'components/Header';
import ListActionItem from 'components/ListActionItem';
import { ethers } from 'ethers';
import {
    amountToUserCurrency,
    getUserCurrencySymbol,
    iptcColors,
} from 'helpers/index';
import { setAppPaymentToAction } from 'helpers/redux/actions/ReduxActions';
import { IRootState } from 'helpers/types';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    RefreshControl,
    Alert,
    NativeSyntheticEvent,
    TextInputEndEditingEventData,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Divider, Button } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { celoWalletRequest } from 'services/celoWallet';

import RecentPayments, { IRecentPaymentsRef } from './RecentPayments';
import ModalScanQR from '../common/ModalScanQR';

const mapStateToProps = (state: IRootState) => {
    const { user, network, app } = state;
    return { user, network, app };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

interface IPaymentTo {
    name: string;
    address: string;
    picture?: string;
}
function PayScreen(props: Props) {
    const navigation = useNavigation();
    const clearPaymentTo = {
        name: '',
        picture: '',
        address: '',
    };

    const [paymentAmount, setPaymentAmount] = useState<string>('');
    const [paymentTo, setPaymentTo] = useState<IPaymentTo>(clearPaymentTo);
    const [editPaymentTo, setEditPaymentTo] = useState(false);
    const [editingPaymentTo, setEditingPaymentTo] = useState(false);
    const [paymentNote, setPaymentNote] = useState<string>('');
    const [refreshing, setRefreshing] = useState(false);
    const [payInProgress, setPayInProgress] = useState(false);
    const recentPaymentsRef = React.createRef<IRecentPaymentsRef>();

    const onRefresh = () => {
        recentPaymentsRef.current?.updateRecentPayments();
        setRefreshing(false);
    };

    useEffect(() => {
        setPaymentTo({
            name: '',
            picture: '',
            address: props.app.paymentToAddress,
        });
    }, [props.app]);

    const handlePay = async () => {
        const { user, network } = props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;
        let addressToSend: string;

        if (communityContract === undefined) {
            // TODO: do something beatiful, la la la
            return;
        }

        try {
            addressToSend = ethers.utils.getAddress(paymentTo.address);
        } catch (e) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('tryingToAddInvalidAddress'),
                [{ text: i18n.t('close') }],
                { cancelable: false }
            );
            return;
        }

        setPayInProgress(true);
        const stableToken = await props.app.kit.contracts.getStableToken();
        celoWalletRequest(
            address,
            stableToken.address,
            stableToken.transfer(
                addressToSend,
                new BigNumber(paymentAmount.replace(',', '.'))
                    .multipliedBy(10 ** 18)
                    .toString()
            ).txo,
            'stabletokentransfer',
            props.app.kit
        )
            .then(() => {
                // TODO: update UI

                Alert.alert(
                    i18n.t('success'),
                    i18n.t('paymentSent'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                setAppPaymentToAction('');
                setPaymentAmount('');
                setPaymentTo(clearPaymentTo);
                setPaymentNote('');
            })
            .catch(() => {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorSendingPayment'),
                    [{ text: i18n.t('close') }],
                    { cancelable: false }
                );
            })
            .finally(() => {
                setPayInProgress(false);
            });
    };

    const handleModalScanQR = async (inputAddress: string) => {
        props.dispatch(setAppPaymentToAction(inputAddress));
        setEditPaymentTo(false);
    };

    const endEditingPaymentTo = (
        e: NativeSyntheticEvent<TextInputEndEditingEventData>
    ) => {
        try {
            const checksumedAddress = ethers.utils.getAddress(
                paymentTo.address
            );
            setPaymentTo({
                name: '',
                picture: '',
                address: checksumedAddress,
            });
        } catch (e) {
            setPaymentTo(clearPaymentTo);
            Alert.alert(
                i18n.t('failure'),
                i18n.t('nameAddressPhoneNotFound'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
        }
        setEditingPaymentTo(false);
    };

    return (
        <>
            <Header
                title={i18n.t('pay')}
                hasHelp
                hasQr
                navigation={navigation}
            />
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Card elevation={8} style={styles.card}>
                    <Card.Content>
                        <TextInput
                            style={{
                                padding: 10,
                                textAlign: 'center',
                                fontSize: 35,
                                fontWeight: 'bold',
                                fontFamily: 'Gelion-Bold',
                            }}
                            placeholder={`${getUserCurrencySymbol(
                                props.user.user
                            )}0`}
                            keyboardType="numeric"
                            value={paymentAmount}
                            onChangeText={setPaymentAmount}
                        />
                        <Text
                            style={{
                                color: 'grey',
                                textAlign: 'center',
                                marginBottom: 8,
                            }}
                        >
                            {i18n.t('balance')}:{' '}
                            {getUserCurrencySymbol(props.user.user)}
                            {amountToUserCurrency(
                                props.user.celoInfo.balance,
                                props.user.user
                            )}
                        </Text>
                        <Divider />
                        {editingPaymentTo || paymentTo.address.length === 0 ? (
                            <TextInput
                                style={{ padding: 10 }}
                                placeholder={i18n.t('nameAddressPhone')}
                                value={paymentTo.address}
                                onChangeText={(text) =>
                                    setPaymentTo({
                                        name: '',
                                        picture: '',
                                        address: text,
                                    })
                                }
                                onEndEditing={endEditingPaymentTo}
                                onFocus={() => setEditingPaymentTo(true)}
                            />
                        ) : (
                            <ListActionItem
                                key={paymentTo.address}
                                onPress={() => setEditPaymentTo(true)}
                                action={{
                                    icon: 'close-circle-outline',
                                    click: () => {
                                        setAppPaymentToAction('');
                                        setPaymentTo(clearPaymentTo);
                                    },
                                }}
                                maxTextTitleLength={24}
                                item={{
                                    from: paymentTo,
                                    avatar: paymentTo.picture,
                                    description: `${paymentTo.address.slice(
                                        0,
                                        8
                                    )}..${paymentTo.address.slice(32, 42)}`,
                                    key: 'send',
                                    timestamp: new Date().getDate(),
                                }}
                                prefix={{
                                    top: getUserCurrencySymbol(props.user.user),
                                }}
                            />
                        )}
                        {/* <Divider /> */}
                        {/* <TextInput
                            style={{ padding: 10 }}
                            placeholder={i18n.t('noteOptional')}
                            value={paymentNote}
                            onChangeText={setPaymentNote}
                        /> */}
                        <Button
                            mode="outlined"
                            disabled={
                                payInProgress ||
                                paymentAmount.length === 0 ||
                                paymentTo.address.length === 0
                            }
                            loading={payInProgress}
                            onPress={handlePay}
                        >
                            {i18n.t('pay')}
                        </Button>
                    </Card.Content>
                </Card>
                <ModalScanQR
                    opened={editPaymentTo}
                    buttonText=""
                    inputText={i18n.t('currentAddress')}
                    selectButtonText={i18n.t('select')}
                    buttonStyle={{
                        backgroundColor: iptcColors.greenishTeal,
                    }}
                    callback={handleModalScanQR}
                />
                <RecentPayments
                    user={props.user}
                    ref={recentPaymentsRef}
                    setPaymentTo={setPaymentTo}
                />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginTop: 10,
    },
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
});

export default connector(PayScreen);
