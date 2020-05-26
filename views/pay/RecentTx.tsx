import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState, IRecentTxListItem } from '../../helpers/types';
import {
    Avatar,
    List,
    Card,
    Divider,
} from 'react-native-paper';
import axios from 'axios';
import config from '../../config';
import { PhoneNumberUtils } from '@celo/utils'
import * as Contacts from 'expo-contacts';
import { tokenTx } from '../../services/api';
import ListActionItem, { IListActionItem } from '../../components/ListActionItem';



const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function RecentTx(props: Props) {
    const [activities, setActivities] = useState<IListActionItem[]>([]);

    useEffect(() => {
        // TODO: improve
        // 1st. simplify
        // 2nd. get names instead of just numbers
        const loadContacts = async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            const mappedContacts = new Map<string, string>();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync();
                if (data.length > 0) {
                    const result = data
                        .filter((contact) => contact.phoneNumbers !== undefined && contact.phoneNumbers[0].number !== undefined)
                        .map((contact) => contact.phoneNumbers![0].number!.replace(/[ ]+/g, ''));

                    const contactsPhoneHash: { contact: string, hash: string }[] = [];
                    result.forEach((contact) => {
                        // catch non valid numbers
                        try {
                            contactsPhoneHash.push({ contact, hash: PhoneNumberUtils.getPhoneHash(contact) });
                        } catch (e) { }
                    });
                    const attestations = await props.network.kit.contracts.getAttestations()
                    const lookupResult = await attestations.lookupPhoneNumbers(contactsPhoneHash.map((c) => c.hash))

                    const mapped = contactsPhoneHash
                        .map((contact) => ({ contact: contact.contact, lookup: lookupResult[contact.hash] }))
                        .filter((matching) => matching.lookup !== undefined)

                    for (let index = 0; index < mapped.length; index++) {
                        const element = mapped[index];
                        mappedContacts.set(
                            Object.keys(element.lookup).filter((address) => element.lookup[address])[0],
                            element.contact,
                        );
                    }
                    console.log(mappedContacts);
                }
            }
        }
        loadContacts();
        tokenTx(props.user.celoInfo.address)
            .then((txs) => setActivities(txs.map((t) => ({
                key: t.from,
                timestamp: t.timestamp,
                description: '',
                from: t.from,
                value: t.txs.toString(),
            }))));
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
                {activities.map((activity) => <ListActionItem
                    key={activity.from}
                    item={activity}
                    suffix={{ top: ' txs' }}
                />)}
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