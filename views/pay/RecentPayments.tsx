import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    Headline,
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

    useImperativeHandle(ref, () => ({
        updateRecentPayments() {
            paymentsTx(props.userAddress)
                .then((payments) => setActivities(payments.map((p) => ({
                    key: p.to,
                    timestamp: p.timestamp,
                    description: '',
                    from: p.to,
                    value: p.value.toString(),
                }))));
        }
    }));

    useEffect(() => {
        paymentsTx(props.userAddress)
            .then((payments) => setActivities(payments.map((p) => ({
                key: p.to,
                timestamp: p.timestamp,
                description: '',
                from: p.to,
                value: p.value.toString(),
            }))));
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