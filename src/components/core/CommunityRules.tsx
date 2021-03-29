import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Headline, Text, Paragraph } from 'react-native-paper';
import { useDispatch } from 'react-redux';
// components
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import WarningRedCircle from 'components/svg/WarningRedCircle';

// redux Actions
import { setAppHasAcceptedTerms } from 'helpers/redux/actions/app';

// services
import CacheStore from 'services/cacheStore';

// translation
import i18n from 'assets/i18n';

// colors
import { ipctColors } from 'styles/index';

function CommunityRules() {
    const dispatch = useDispatch();
    const handleAcceptRules = async () => {
        await CacheStore.cacheAcceptCommunityRules();
        dispatch(setAppHasAcceptedTerms(true));
    };

    return (
        <View>
            <Card style={styles.cardContainer}>
                <Card.Content>
                    <View style={styles.headlineContainer}>
                        <WarningRedCircle style={{ width: 16, height: 16 }} />
                        <Headline style={styles.headerTitle}>
                            {i18n.t('newManagerRules.title')}
                        </Headline>
                    </View>
                    <Paragraph style={styles.paragraphContent}>
                        <Text style={styles.ordering}>1 -</Text>{' '}
                        {i18n.t('newManagerRules.first')}
                    </Paragraph>
                    <Paragraph style={styles.paragraphContent}>
                        <Text style={styles.ordering}>2 -</Text>{' '}
                        {i18n.t('newManagerRules.second')}
                    </Paragraph>
                    <Paragraph style={styles.paragraphContent}>
                        <Text style={styles.ordering}>3 -</Text>{' '}
                        {i18n.t('newManagerRules.third')}
                    </Paragraph>
                    <Paragraph style={styles.paragraphContent}>
                        <Text style={styles.ordering}>4 -</Text>{' '}
                        {i18n.t('newManagerRules.fourth')}
                    </Paragraph>
                    <Paragraph style={styles.paragraphContent}>
                        <Text style={styles.ordering}>6 -</Text>{' '}
                        {i18n.t('newManagerRules.fifth')}
                    </Paragraph>
                    <Paragraph style={styles.paragraphContent}>
                        <Text style={styles.ordering}>7 -</Text>{' '}
                        {i18n.t('newManagerRules.sixth')}
                    </Paragraph>
                    <Paragraph style={styles.paragraphContent}>
                        {i18n.t('newManagerRules.seventh')}
                    </Paragraph>
                    <Paragraph
                        style={[
                            styles.paragraphContent,
                            { fontFamily: 'Inter-Bold' },
                        ]}
                    >
                        {i18n.t('newManagerRules.warning')}
                    </Paragraph>
                </Card.Content>
            </Card>
            <Button
                modeType="default"
                bold
                style={styles.btnAccept}
                onPress={handleAcceptRules}
            >
                {i18n.t('newManagerRules.btnText')}
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
