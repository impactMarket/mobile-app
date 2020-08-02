import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    RefreshControl,
    Alert
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import { IRootState } from 'helpers/types';
import {
    Card,
    Divider,
    Button
} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Header from 'components/Header';
import RecentPayments, { IRecentPaymentsRef } from './RecentPayments';
import {
    amountToUserCurrency,
    getUserCurrencySymbol
} from 'helpers/index';
import i18n from 'assets/i18n';
import { ethers } from 'ethers';
import { celoWalletRequest } from 'services/celoWallet';
import ListActionItem from 'components/ListActionItem';


const mapStateToProps = (state: IRootState) => {
    const { user, network, app } = state
    return { user, network, app }
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function PayScreen(props: Props) {
    const navigation = useNavigation();

    const [paymentAmount, setPaymentAmount] = useState<string>('');
    const [paymentTo, setPaymentTo] = useState<string>('');
    const [paymentNote, setPaymentNote] = useState<string>('');
    const [refreshing, setRefreshing] = useState(false);
    const [payInProgress, setPayInProgress] = useState(false);
    const recentPaymentsRef = React.createRef<IRecentPaymentsRef>();

    const onRefresh = () => {
        recentPaymentsRef.current?.updateRecentPayments();
        setRefreshing(false);
    }

    useEffect(() => {
        setPaymentTo(props.app.paymentToAddress);
    }, [props.app]);

    const handlePay = async () => {
        const { user, network } = props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;
        let addressToAdd: string;

        if (communityContract === undefined) {
            // TODO: do something beatiful, la la la
            return;
        }

        try {
            addressToAdd = ethers.utils.getAddress(paymentTo);
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
        const stableToken = await props.network.kit.contracts.getStableToken()
        celoWalletRequest(
            address,
            stableToken.address,
            await stableToken.transfer(addressToAdd, paymentAmount),
            'stabletokentransfer',
            network,
        ).then(() => {

            // TODO: update UI

            Alert.alert(
                i18n.t('success'),
                i18n.t('paymentSent'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
        }).catch(() => {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('errorSendingPayment'),
                [{ text: i18n.t('close') }],
                { cancelable: false }
            );
        }).finally(() => {
            setPayInProgress(false);
        });
    }

    return (
        <>
            <Header
                title={i18n.t('pay')}
                hasHelp={true}
                hasQr={true}
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
                            style={{ padding: 10, textAlign: 'center', fontSize: 35, fontWeight: 'bold', fontFamily: 'Gelion-Bold' }}
                            placeholder={`${getUserCurrencySymbol(props.user.user)}0`}
                            keyboardType="numeric"
                            value={paymentAmount}
                            onChangeText={setPaymentAmount}
                        />
                        <Text style={{
                            color: 'grey',
                            textAlign: 'center',
                            marginBottom: 8
                        }}>
                            {i18n.t('balance')}: {getUserCurrencySymbol(props.user.user)}
                            {amountToUserCurrency(props.user.celoInfo.balance, props.user.user)}
                        </Text>
                        <Divider />
                        {paymentTo.length === 0 ? <TextInput
                            style={{ padding: 10 }}
                            placeholder={i18n.t('nameAddressPhone')}
                            value={paymentTo}
                            onChangeText={setPaymentTo}
                        /> : <ListActionItem
                                key={paymentTo}
                                maxTextTitleLength={24}
                                item={{
                                    from: paymentTo,
                                    description: '',
                                    key: 'send',
                                    timestamp: new Date().getDate(),
                                }}
                                prefix={{ top: getUserCurrencySymbol(props.user.user) }}
                            />}
                        <Divider />
                        <TextInput
                            style={{ padding: 10 }}
                            placeholder={i18n.t('noteOptional')}
                            value={paymentNote}
                            onChangeText={setPaymentNote}
                        />
                        <Button
                            mode="outlined"
                            disabled={payInProgress || paymentAmount.length === 0 || paymentTo.length === 0}
                            loading={payInProgress}
                            onPress={handlePay}
                        >
                            {i18n.t('pay')}
                        </Button>
                    </Card.Content>
                </Card>
                <RecentPayments user={props.user} ref={recentPaymentsRef} />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginTop: 10
    },
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
});

export default connector(PayScreen);