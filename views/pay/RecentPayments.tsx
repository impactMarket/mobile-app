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
    Headline,
} from 'react-native-paper';
import axios from 'axios';
import config from '../../config';
import { PhoneNumberUtils } from '@celo/utils'
import * as Contacts from 'expo-contacts';
import { tokenTx } from '../../services/api';
import ListActionItem, { IListActionItem } from '../../components/ListActionItem';
import faker from 'faker';



const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function RecentPayments(props: Props) {
    const [activities, setActivities] = useState<IListActionItem[]>([]);

    // TODO: load activity history
    useEffect(() => {
        const loadActivities = () => {
            const _activities = [
                {
                    title: faker.name.firstName(),
                    from: faker.name.firstName(),
                    avatar: faker.image.avatar(),
                    description: faker.phone.phoneNumber('+351 ### ### ###'),
                    value: faker.finance.amount(1, 39, 2),
                    timestamp: 1590519328,
                    key: '1590519328',
                },
                {
                    title: faker.name.firstName(),
                    from: faker.name.firstName(),
                    avatar: faker.image.avatar(),
                    description: faker.phone.phoneNumber('+351 ### ### ###'),
                    value: faker.finance.amount(1, 39, 2),
                    timestamp: 1590119328,
                    key: '1590119328',
                }
            ];
            _activities.sort((a, b) => a.timestamp - b.timestamp);
            setActivities(_activities.reverse());
        }
        loadActivities();
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