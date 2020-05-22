import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../helpers/types';
import {
    Avatar,
    List,
    Card,
    Divider,
} from 'react-native-paper';
import axios from 'axios';
import config from '../../config';



const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

interface IRecentTxListItem {
    from: string;
    phone: number; // lol
    txs: number;
    timestamp: number;
}
function RecentTx(props: Props) {
    const [activities, setActivities] = useState<IRecentTxListItem[]>([]);

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
            const result: IRecentTxListItem[] = [];
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
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
});

export default connector(RecentTx);