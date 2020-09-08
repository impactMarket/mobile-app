import { ContractKit } from '@celo/contractkit';
import { fetchContacts } from '@celo/dappkit';
import { PhoneNumberUtils } from '@celo/utils';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import * as SQLite from 'expo-sqlite';

export const getCacheContactsAddress = async () => {
    // const db = SQLite.openDatabase('impactMarket', '0.1');

    // db.transaction((tx) => {
    //     tx.executeSql(
    //         'create table if not exists contactsAddress (id integer primary key not null, accountaddress text, phonenumber text, name text);'
    //     );
    // });

    // db.transaction(
    //     (tx) => {
    //         tx.executeSql(
    //             'insert into contactsAddress (accountaddress, phonenumber, name) values (?, ?, ?)',
    //             ['0xo83u45v3u5', '892349283', 'John Doe']
    //         );
    //         tx.executeSql('select * from contactsAddress;', [], (_, { rows }) =>
    //             // console.log(JSON.stringify(rows))
    //         );
    //     },
    //     undefined,
    //     () => {}
    // );

    // db.transaction((tx) => {
    //     tx.executeSql(`select * from contactsAddress;`, [], (_, resultSet) =>
    //         // console.log(resultSet)
    //     );
    // });
};

export const crossContactsAddress = async (kit: ContractKit) => {
    const { status } = await Permissions.askAsync(Permissions.CONTACTS);

    if (status !== Permissions.PermissionStatus.GRANTED) {
        return;
    }

    const { phoneNumbersByAddress } = await fetchContacts(kit);

    // console.log(phoneNumbersByAddress);

    // TODO: simplify
    // const { status } = await Contacts.requestPermissionsAsync();
    // const mappedContacts = new Map<string, string>();
    // if (status === 'granted') {
    //     const { data } = await Contacts.getContactsAsync();
    //     if (data.length > 0) {
    //         const result = data
    //             .filter(
    //                 (contact) =>
    //                     contact.phoneNumbers !== undefined &&
    //                     contact.phoneNumbers[0].number !== undefined
    //             )
    //             .map((contact) =>
    //                 contact.phoneNumbers![0].number!.replace(/[ ]+/g, '')
    //             );

    //         const contactsPhoneHash: { contact: string; hash: string }[] = [];
    //         result.forEach((contact) => {
    //             // catch non valid numbers
    //             try {
    //                 contactsPhoneHash.push({
    //                     contact,
    //                     hash: PhoneNumberUtils.getPhoneHash(contact),
    //                 });
    //             } catch (e) {}
    //         });
    //         const attestations = await kit.contracts.getAttestations();
    //         const lookupResult = await attestations.lookupPhoneNumbers(
    //             contactsPhoneHash.map((c) => c.hash)
    //         );

    //         // TODO: get names instead of just numbers
    //         const mapped = contactsPhoneHash
    //             .map((contact) => ({
    //                 contact: contact.contact,
    //                 lookup: lookupResult[contact.hash],
    //             }))
    //             .filter((matching) => matching.lookup !== undefined);

    //         for (let index = 0; index < mapped.length; index++) {
    //             const element = mapped[index];
    //             mappedContacts.set(
    //                 Object.keys(element.lookup).filter(
    //                     (address) => element.lookup[address]
    //                 )[0],
    //                 element.contact
    //             );
    //         }
    //         // log(mappedContacts);
    //     }
    // }
};
