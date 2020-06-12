import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    Headline, ActivityIndicator,
} from 'react-native-paper';
import { paymentsTx } from '../../services/api';
import ListActionItem, { IListActionItem } from '../../components/ListActionItem';


interface IRecentPaymentsProps {
    userAddress: string;
}
export interface IRecentPaymentsRef {
    updateRecentPayments: () => void;
}
const RecentPayments = React.forwardRef<IRecentPaymentsRef, IRecentPaymentsProps>((props, ref) => {
    const [activities, setActivities] = useState<IListActionItem[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(true);

    useImperativeHandle(ref, () => ({
        updateRecentPayments() {
            setLoadingPayments(true);
            paymentsTx(props.userAddress)
                .then((payments) => {
                    setActivities(payments.map((p) => ({
                        key: p.to.address,
                        timestamp: p.timestamp,
                        description: '',
                        from: p.to.name,
                        value: p.value.toString(),
                    })))
                    setLoadingPayments(false);
                });
        }
    }));

    useEffect(() => {
        paymentsTx(props.userAddress)
            .then((payments) => {
                setActivities(payments.map((p) => ({
                    key: p.to.address,
                    timestamp: p.timestamp,
                    description: '',
                    from: p.to.name,
                    value: p.value.toString(),
                })));
                setLoadingPayments(false);
            });
    }, []);

    return (
        <View style={styles.card}>
            <Headline
                style={{
                    opacity: 0.48,
                    fontFamily: "Gelion-Bold",
                    fontSize: 13,
                    fontWeight: "500",
                    fontStyle: "normal",
                    lineHeight: 12,
                    letterSpacing: 0.7,
                }}
            >
                RECENT
            </Headline>
            <ActivityIndicator animating={loadingPayments} />
            {activities.map((activity) => <ListActionItem
                key={activity.from}
                item={activity}
                prefix={{ top: '$' }}
            />)}
        </View>
    );
})

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
});

export default RecentPayments;