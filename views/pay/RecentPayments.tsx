import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../helpers/types';
import {
    Headline,
} from 'react-native-paper';
import { paymentsTx } from '../../services/api';
import ListActionItem, { IListActionItem } from '../../components/ListActionItem';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function RecentPayments(props: Props) {
    const [activities, setActivities] = useState<IListActionItem[]>([]);

    useEffect(() => {
        paymentsTx(props.user.celoInfo.address)
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
                RECENT PAYMENTS
            </Headline>
            {activities.map((activity) => <ListActionItem
                key={activity.from}
                item={activity}
                prefix={{ top: '$' }}
            />)}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
});

export default connector(RecentPayments);