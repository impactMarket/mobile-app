import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput
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
import RecentPayments from './RecentPayments';


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

    return (
        <>
            <Header
                title="Pay"
                hasHelp={true}
                hasQr={true}
                navigation={navigation}
            />
            <ScrollView style={styles.scrollView}>
                <Card style={styles.card}>
                    <Card.Content>
                        <TextInput
                            style={{ padding: 10, textAlign: 'center', fontSize: 35, fontWeight: 'bold', fontFamily: 'Gelion-Bold' }}
                            placeholder='0$'
                            keyboardType="numeric"
                            value={paymentAmount}
                            onChangeText={setPaymentAmount}
                        />
                        <Text style={{ color: 'grey', textAlign: 'center', marginBottom: 8 }}>{`Balance: ${props.user.celoInfo.balance}$`}</Text>
                        <Divider />
                        <TextInput
                            style={{ padding: 10 }}
                            placeholder='Name, address or phone number'
                            value={paymentTo}
                            onChangeText={setPaymentTo}
                        />
                        <Divider />
                        <TextInput
                            style={{ padding: 10 }}
                            placeholder='Note (optional)'
                            value={paymentNote}
                            onChangeText={setPaymentNote}
                        />
                        <Button
                            mode="outlined"
                            disabled={true}
                            onPress={() => console.log('oi')}
                        >
                            Pay
                        </Button>
                    </Card.Content>
                </Card>
                <RecentPayments />
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
    appbar: {
        backgroundColor: 'transparent',
    },
});

export default connector(PayScreen);