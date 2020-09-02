import i18n from 'assets/i18n';
import ListActionItem, { IListActionItem } from 'components/ListActionItem';
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import { Headline, ActivityIndicator } from 'react-native-paper';
import Api from 'services/api';

interface IRecentTxProps {
    userAddress: string;
}
export interface IRecentTxRef {
    updateRecentTx: () => void;
}
const RecentTx = React.forwardRef<IRecentTxRef, IRecentTxProps>(
    (props, ref) => {
        const [activities, setActivities] = useState<IListActionItem[]>([]);
        const [loadingTxs, setLoadingTxs] = useState(true);

        useImperativeHandle(ref, () => ({
            updateRecentTx() {
                setLoadingTxs(true);
                Api.tokenTx(props.userAddress).then((txs) => {
                    setActivities(
                        txs.map((t) => ({
                            key: t.from.address,
                            timestamp: t.timestamp,
                            description: '',
                            from:
                                t.from.name === null
                                    ? t.from.address
                                    : t.from.name,
                            value: t.txs.toString(),
                        }))
                    );
                    setLoadingTxs(false);
                });
            },
        }));

        useEffect(() => {
            Api.tokenTx(props.userAddress).then((txs) => {
                setActivities(
                    txs.map((t) => ({
                        key: t.from.address,
                        timestamp: t.timestamp,
                        description: '',
                        from:
                            t.from.name === null ? t.from.address : t.from.name,
                        value: t.txs.toString(),
                    }))
                );
                setLoadingTxs(false);
            });
        }, []);

        return (
            <View style={styles.card}>
                <Headline
                    style={{
                        opacity: 0.48,
                        fontFamily: 'Gelion-Bold',
                        fontSize: 13,
                        fontWeight: '500',
                        fontStyle: 'normal',
                        lineHeight: 12,
                        letterSpacing: 0.7,
                    }}
                >
                    {i18n.t('recentTransactions').toUpperCase()}
                </Headline>
                <ActivityIndicator animating={loadingTxs} />
                {activities.map((activity) => (
                    <ListActionItem
                        key={activity.from}
                        item={activity}
                        suffix={{ top: ' txs' }}
                    />
                ))}
            </View>
        );
    }
);

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
});

export default RecentTx;
