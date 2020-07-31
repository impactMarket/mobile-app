import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    Headline, ActivityIndicator,
} from 'react-native-paper';
import Api from '../../services/api';
import ListActionItem, { IListActionItem } from '../../components/ListActionItem';
import i18n from '../../assets/i18n';


interface IRecentTxProps {
    userAddress: string;
}
export interface IRecentTxRef {
    updateRecentTx: () => void;
}
const RecentTx = React.forwardRef<IRecentTxRef, IRecentTxProps>((props, ref) => {
    const [activities, setActivities] = useState<IListActionItem[]>([]);
    const [loadingTxs, setLoadingTxs] = useState(true);

    useImperativeHandle(ref, () => ({
        updateRecentTx() {
            setLoadingTxs(true);
            Api.tokenTx(props.userAddress)
                .then((txs) => {
                    setActivities(txs.map((t) => ({
                        key: t.from.address,
                        timestamp: t.timestamp,
                        description: '',
                        from: t.from.name,
                        value: t.txs.toString(),
                    })));
                    setLoadingTxs(false);
                });
        }
    }));

    useEffect(() => {
        // // TODO: improve
        // // 1st. simplify
        // // 2nd. get names instead of just numbers
        // const loadContacts = async () => {
        //     const { status } = await Contacts.requestPermissionsAsync();
        //     const mappedContacts = new Map<string, string>();
        //     if (status === 'granted') {
        //         const { data } = await Contacts.getContactsAsync();
        //         if (data.length > 0) {
        //             const result = data
        //                 .filter((contact) => contact.phoneNumbers !== undefined && contact.phoneNumbers[0].number !== undefined)
        //                 .map((contact) => contact.phoneNumbers![0].number!.replace(/[ ]+/g, ''));

        //             const contactsPhoneHash: { contact: string, hash: string }[] = [];
        //             result.forEach((contact) => {
        //                 // catch non valid numbers
        //                 try {
        //                     contactsPhoneHash.push({ contact, hash: PhoneNumberUtils.getPhoneHash(contact) });
        //                 } catch (e) { }
        //             });
        //             const attestations = await props.network.kit.contracts.getAttestations()
        //             const lookupResult = await attestations.lookupPhoneNumbers(contactsPhoneHash.map((c) => c.hash))

        //             const mapped = contactsPhoneHash
        //                 .map((contact) => ({ contact: contact.contact, lookup: lookupResult[contact.hash] }))
        //                 .filter((matching) => matching.lookup !== undefined)

        //             for (let index = 0; index < mapped.length; index++) {
        //                 const element = mapped[index];
        //                 mappedContacts.set(
        //                     Object.keys(element.lookup).filter((address) => element.lookup[address])[0],
        //                     element.contact,
        //                 );
        //             }
        //             // log(mappedContacts);
        //         }
        //     }
        // }
        // loadContacts();
        Api.tokenTx(props.userAddress)
            .then((txs) => {
                setActivities(txs.map((t) => ({
                    key: t.from.address,
                    timestamp: t.timestamp,
                    description: '',
                    from: t.from.name,
                    value: t.txs.toString(),
                })));
                setLoadingTxs(false);
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
                {i18n.t('recentTransactions').toUpperCase()}
            </Headline>
            <ActivityIndicator animating={loadingTxs} />
            {activities.map((activity) => <ListActionItem
                key={activity.from}
                item={activity}
                suffix={{ top: ' txs' }}
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

export default RecentTx;