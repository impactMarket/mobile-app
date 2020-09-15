import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import Header from 'components/Header';
import * as React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';

export default function ClaimExplainedScreen() {
    const navigation = useNavigation();

    return (
        <>
            <Header
                title={i18n.t('howClaimWorks')}
                navigation={navigation}
                hasBack
            />
            <ScrollView style={styles.contentView}>
                <Text style={styles.textInfo}>{i18n.t('claimExplained1')}</Text>
                <Text style={styles.textInfo}>{i18n.t('claimExplained2')}</Text>
            </ScrollView>
        </>
    );
}
const styles = StyleSheet.create({
    contentView: {
        marginHorizontal: 30,
    },
    textInfo: {
        fontFamily: 'Gelion-Regular',
        fontStyle: 'normal',
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 18
    },
});
