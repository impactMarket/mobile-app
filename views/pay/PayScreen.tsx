import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../helpers/types';
import { Appbar, Avatar, List, Card, Divider, Button, Headline } from 'react-native-paper';
import { ethers } from 'ethers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import config from '../../config';


interface IPayScreenProps {
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IPayScreenProps
interface IPayScreenListItem {
    from: string;
    phone: number; // lol
    txs: number;
    timestamp: number;
}
interface IPayment {
    amount: string;
    to: string;
    note: string;
}
function PayScreen(props: Props) {
    const navigation = useNavigation();

    const [activities, setActivities] = useState<IPayScreenListItem[]>([]);
    const [payment, setPayment] = useState<IPayment>({ amount: '', to: '', note: '' });

    useEffect(() => {
        const loadHistory = async () => {
            // also get and store transactions
            // TODO: move this to API
            const results = await axios.get(
                `${config.baseBlockScoutApiUrl}?module=account&action=tokentx&address=${props.user.celoInfo.address}`);
            // filter necessary
            const rawTxs: { from: string, to: string, timestamp: number }[] = results
                .data.result.map((result: any) => (
                    { from: result.from, to: result.to, timestamp: parseInt(result.timeStamp, 10) }
                )).slice(0, 20);
            let txs: { timestamp: number, address: string }[] = rawTxs.map((tx) => {
                if (tx.from.toLowerCase() === props.user.celoInfo.address.toLowerCase()) {
                    return { timestamp: tx.timestamp, address: tx.to }
                }
                return { timestamp: tx.timestamp, address: tx.from }
            })
            // sort
            txs = txs.sort((a, b) => a.timestamp - b.timestamp);
            // group
            const result: IPayScreenListItem[] = [];
            const groupedTxs = txs.reduce((r, a) => {
                r[a.address] = r[a.address] || [];
                r[a.address].push(a);
                return r;
            }, Object.create(null));
            Object.keys(groupedTxs).forEach((k) => result.push(
                { from: k, phone: 555, txs: groupedTxs[k].length, timestamp: groupedTxs[k][0].timestamp }
            ))
            return result.slice(0, Math.min(5, result.length));
        }
        loadHistory().then(setActivities);
    }, []);

    return (
        <SafeAreaView>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="Pay" />
                <Text>{`Balance: ${props.user.celoInfo.balance}$`}</Text>
                <Appbar.Action icon="help-circle-outline" />
                <Appbar.Action icon="qrcode" onPress={() => navigation.navigate('UserShowScanQRScreen')} />
            </Appbar.Header>
            <ScrollView style={styles.scrollView}>
                <Card style={styles.card}>
                    <Card.Content>
                        <TextInput
                            style={{ padding: 10, textAlign: 'center', fontSize: 35, fontWeight: 'bold' }}
                            placeholder='0$'
                            keyboardType="numeric"
                            value={payment.amount}
                            onChangeText={text => setPayment({ ...payment, amount: text })}
                        />
                        <Divider />
                        <TextInput
                            style={{ padding: 10 }}
                            placeholder='Name, address or phone number'
                            value={payment.to}
                            onChangeText={text => setPayment({ ...payment, to: text })}
                        />
                        <Divider />
                        <TextInput
                            style={{ padding: 10 }}
                            placeholder='Note (optional)'
                            value={payment.note}
                            onChangeText={text => setPayment({ ...payment, note: text })}
                        />
                        <Button
                            mode="outlined"
                            onPress={() => console.log('oi')}
                        >
                            Pay
                        </Button>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Title
                        title=""
                        style={{ backgroundColor: '#f0f0f0' }}
                        subtitleStyle={{ color: 'grey' }}
                        subtitle="RECENT"
                    />
                    <Card.Content>
                        {activities.map((activity) => <View key={activity.from}>
                            <Divider />
                            <List.Item
                                title={activity.from}
                                description={activity.phone}
                                left={() => <Avatar.Text size={46} label={activity.from.slice(0, 1)} />}
                                right={() => <View>
                                    <Text style={{ color: 'grey' }}>{activity.txs} transactions</Text>
                                </View>}
                            />
                        </View>)}
                    </Card.Content>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginTop: 10,
        marginBottom: 80
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