import i18n from 'assets/i18n';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import WarningRedCircle from 'components/svg/WarningRedCircle';
import {
    setAppHasManagerAcceptedTerms,
    setAppHasBeneficiaryAcceptedTerms,
} from 'helpers/redux/actions/app';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Headline, Text, Paragraph } from 'react-native-paper';
import { useDispatch } from 'react-redux';
// services
import CacheStore from 'services/cacheStore';
import { ipctColors } from 'styles/index';

function CommunityRules({ caller }: { caller: string }) {
    const dispatch = useDispatch();
    const handleAcceptRules = async () => {
        if (caller === 'MANAGER') {
            await CacheStore.cacheManagerAcceptCommunityRules();
            dispatch(setAppHasManagerAcceptedTerms(true));
        } else {
            await CacheStore.cacheBeneficiaryAcceptCommunityRules();
            dispatch(setAppHasBeneficiaryAcceptedTerms(true));
        }
    };

    return (
        <View>
            <Card style={styles.cardContainer}>
                <View style={styles.headlineContainer}>
                    <WarningRedCircle style={{ width: 16, height: 16 }} />
                    <Headline style={styles.headerTitle}>
                        {caller === 'MANAGER'
                            ? i18n.t('manager.rules.title')
                            : i18n.t('beneficiary.rules.title')}
                    </Headline>
                </View>
                <Paragraph style={styles.paragraphContent}>
                    <Text style={styles.ordering}>1 -</Text>{' '}
                    {caller === 'MANAGER'
                        ? i18n.t('manager.rules.first')
                        : i18n.t('beneficiary.rules.first')}
                </Paragraph>
                <Paragraph style={styles.paragraphContent}>
                    <Text style={styles.ordering}>2 -</Text>{' '}
                    {caller === 'MANAGER'
                        ? i18n.t('manager.rules.second')
                        : i18n.t('beneficiary.rules.second')}
                </Paragraph>
                <Paragraph style={styles.paragraphContent}>
                    <Text style={styles.ordering}>3 -</Text>{' '}
                    {caller === 'MANAGER'
                        ? i18n.t('manager.rules.third')
                        : i18n.t('beneficiary.rules.third')}
                </Paragraph>
                <Paragraph style={styles.paragraphContent}>
                    <Text style={styles.ordering}>4 -</Text>{' '}
                    {caller === 'MANAGER'
                        ? i18n.t('manager.rules.fourth')
                        : i18n.t('beneficiary.rules.fourth')}
                </Paragraph>
                <Paragraph style={styles.paragraphContent}>
                    <Text style={styles.ordering}>6 -</Text>{' '}
                    {caller === 'MANAGER'
                        ? i18n.t('manager.rules.fifth')
                        : i18n.t('beneficiary.rules.fifth')}
                </Paragraph>
                <Paragraph style={styles.paragraphContent}>
                    <Text style={styles.ordering}>7 -</Text>{' '}
                    {caller === 'MANAGER'
                        ? i18n.t('manager.rules.sixth')
                        : i18n.t('beneficiary.rules.sixth')}
                </Paragraph>
                <Paragraph style={styles.paragraphContent}>
                    {caller === 'MANAGER'
                        ? i18n.t('manager.rules.seventh')
                        : i18n.t('beneficiary.rules.seventh')}
                </Paragraph>
                <Paragraph
                    style={[
                        styles.paragraphContent,
                        { fontFamily: 'Inter-Bold' },
                    ]}
                >
                    {caller === 'MANAGER'
                        ? i18n.t('manager.rules.warning')
                        : i18n.t('beneficiary.rules.warning')}
                </Paragraph>
            </Card>
            <Button
                modeType="default"
                bold
                style={styles.btnAccept}
                onPress={handleAcceptRules}
            >
                {i18n.t('manager.rules.btnText')}
            </Button>
        </View>
    );
}

export default CommunityRules;

const styles = StyleSheet.create({
    cardContainer: {
        padding: 16,
        margin: 16,
        borderStyle: 'solid',
        borderColor: '#EB5757',
        borderWidth: 2,
        borderRadius: 8,
        elevation: 0,
    },
    headlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: ipctColors.nileBlue,
        fontFamily: 'Manrope-Bold',
        fontSize: 16,
        lineHeight: 22,
        letterSpacing: 0.7,
        marginLeft: 10,
    },
    ordering: {
        fontFamily: 'Inter-Bold',
    },
    paragraphContent: {
        textAlign: 'left',
        marginTop: 16,

        color: ipctColors.nileBlue,
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        lineHeight: 24,
        letterSpacing: 0.7,
    },
    btnAccept: {
        fontFamily: 'Manrope-Medium',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.7,
        margin: 16,
        borderRadius: 8,
    },
});
