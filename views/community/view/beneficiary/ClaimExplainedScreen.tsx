import * as React from 'react';
import {
    Text,
    ScrollView,
    StyleSheet,
} from 'react-native';
import Header from '../../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../../../assets/i18n';

export default function ClaimExplainedScreen() {
    const navigation = useNavigation();

    return (
        <>
            <Header
                title={i18n.t('howClaimWorks')}
                navigation={navigation}
                hasBack={true}
            />
            <ScrollView style={styles.contentView}>
                <Text style={styles.textInfo}>Each community has, in a smart contract, a list of beneficiaries addresses that can access UBI and a set of rules decided/governed by their leaders/local charities. These rules could include something like a transaction fee for the contract creator.</Text>
                <Text style={styles.textInfo}>An initial approach would be, for example, any beneficiary/user in that list can claim $1 cUSD from that smart contract on a recurring basis with an interval of at least 24h before being able to claim another $1 cUSD, up to a cumulative total of $500 cUSD. Every time a beneficiary claims $1 cUSD, 1 hour is added to the interval time of that user, meaning that will have to wait at least 25h after claiming its second $1 cUSD. Local’s user currency should be used/displayed as main currency, based on its value against cUSD.</Text>
            </ScrollView>
        </>
    );
}
const styles = StyleSheet.create({
    contentView: {
        marginHorizontal: 20,
    },
    textInfo: {
        fontFamily: "Gelion-Regular",
        fontStyle: "normal",
        textAlign: "center",
        marginVertical: 20
    }
});