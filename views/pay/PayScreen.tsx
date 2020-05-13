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
    const [activities, setActivities] = useState<IPayScreenListItem[]>([]);
    const [payment, setPayment] = useState<IPayment>({ amount: '', to: '', note: '' });

    // TODO: load activity history
    useEffect(() => {
        const loadHistory = () => {
            const activities = [
                {
                    from: 'Fehsolna',
                    phone: 89713782,
                    txs: 5,
                    timestamp: 17263188,
                },
                {
                    from: 'Curitiba',
                    phone: 72319093,
                    txs: 1,
                    timestamp: 17263179,
                }
            ];
            console.log('load history');
            return activities.sort((a, b) => a.timestamp - b.timestamp);
        }
        setActivities(loadHistory());
    }, []);

    return (
        <SafeAreaView>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="Pay" />
                <Text>{'Balance: ' + props.user.celoInfo.balance + '$'}</Text>
                <Appbar.Action icon="help-circle-outline" />
                <Appbar.Action icon="qrcode" />
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
                    <Card.Content>
                        <Headline>Recent</Headline>
                        {activities.map((activity) => <View key={activity.timestamp}>
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