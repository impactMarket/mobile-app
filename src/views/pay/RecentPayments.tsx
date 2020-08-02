import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    Headline, ActivityIndicator,
} from 'react-native-paper';
import Api from 'services/api';
import ListActionItem, { IListActionItem } from 'components/ListActionItem';
import { amountToUserCurrency, getUserCurrencySymbol } from 'helpers/index';
import { IUserState, IPaymentsTxAPI } from 'helpers/types';
import i18n from 'assets/i18n';


interface IRecentPaymentsProps {
    user: IUserState;
}
export interface IRecentPaymentsRef {
    updateRecentPayments: () => void;
}
const RecentPayments = React.forwardRef<IRecentPaymentsRef, IRecentPaymentsProps>((props, ref) => {
    const [activities, setActivities] = useState<IListActionItem[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(true);

    const mapPayments = (p: IPaymentsTxAPI) => ({
        key: p.to.address,
        timestamp: p.timestamp,
        description: '',
        from: p.to.name,
        value: amountToUserCurrency(p.value, props.user.user).toString(),
    })

    useImperativeHandle(ref, () => ({
        updateRecentPayments() {
            setLoadingPayments(true);
            Api.paymentsTx(props.user.celoInfo.address)
                .then((payments) => {
                    setActivities(payments.map(mapPayments))
                    setLoadingPayments(false);
                });
        }
    }));

    useEffect(() => {
        Api.paymentsTx(props.user.celoInfo.address)
            .then((payments) => {
                setActivities(payments.map(mapPayments));
                setLoadingPayments(false);
            });
    }, []);

    return (
        <View style={styles.container}>
            <Headline style={styles.headline}>
                {i18n.t('recent').toUpperCase()}
            </Headline>
            <ActivityIndicator animating={loadingPayments} />
            {activities.map((activity) => <ListActionItem
                key={activity.from}
                item={activity}
                prefix={{ top: getUserCurrencySymbol(props.user.user) }}
            />)}
        </View>
    );
})

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    headline: {
        opacity: 0.48,
        fontFamily: "Gelion-Bold",
        fontSize: 13,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 12,
        letterSpacing: 0.7,
    }
});

export default RecentPayments;