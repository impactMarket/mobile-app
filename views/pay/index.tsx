import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    RefreshControl
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import { IRootState } from '../../helpers/types';
import {
    Card,
    Divider,
    Button
} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import RecentPayments, { IRecentPaymentsRef } from './RecentPayments';
import {
    amountToUserCurrency,
    getUserCurrencySymbol
} from '../../helpers';
import i18n from '../../assets/i18n';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
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
    const recentPaymentsRef = React.createRef<IRecentPaymentsRef>();

    const onRefresh = () => {
        recentPaymentsRef.current?.updateRecentPayments();
        setRefreshing(false);
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
                <Card style={styles.card}>
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
                            Balance: {getUserCurrencySymbol(props.user.user)}
                            {amountToUserCurrency(props.user.celoInfo.balance, props.user.user)}
                        </Text>
                        <Divider />
                        <TextInput
                            style={{ padding: 10 }}
                            placeholder={i18n.t('nameAddressPhone')}
                            value={paymentTo}
                            onChangeText={setPaymentTo}
                        />
                        <Divider />
                        <TextInput
                            style={{ padding: 10 }}
                            placeholder={i18n.t('noteOptional')}
                            value={paymentNote}
                            onChangeText={setPaymentNote}
                        />
                        <Button
                            mode="outlined"
                            disabled={true}
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