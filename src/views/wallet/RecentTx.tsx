import i18n from 'assets/i18n';
import ListActionItem, { IListActionItem } from 'components/ListActionItem';
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import { Headline, ActivityIndicator } from 'react-native-paper';
import Api from 'services/api';
import { getAvatarFromId } from 'helpers/index';

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
                            key: t.timestamp.toString(),
                            timestamp: t.timestamp,
                            description: '',
                            from: t.from,
                            value: '',
                            avatar: t.picture
                                ? t.picture.length > 3
                                    ? t.picture
                                    : getAvatarFromId(parseInt(t.picture))
                                : undefined,
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
                        key: t.timestamp.toString(),
                        timestamp: t.timestamp,
                        description: '',
                        from: t.from,
                        value: '',
                        avatar: t.picture
                            ? t.picture.length > 3
                                ? t.picture
                                : getAvatarFromId(parseInt(t.picture))
                            : undefined,
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
                    <ListActionItem key={activity.key} item={activity} />
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
