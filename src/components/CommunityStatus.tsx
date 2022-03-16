import { estimateCommunityRemainFunds } from '@impact-market/utils';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import { amountToCurrency } from 'helpers/currency';
import { calculateCommunityProgress } from 'helpers/index';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import {
    ipctColors,
    ipctFontSize,
    ipctLineHeight,
    ipctSpacing,
} from 'styles/index';

import WarningTriangle from './svg/WarningTriangle';

interface ICommuntyStatusProps {
    community: CommunityAttributes;
}

export default function CommunityStatus(props: ICommuntyStatusProps) {
    const { community } = props;
    const user = useSelector((state: IRootState) => state.user.metadata);

    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );

    const maxClaim = new BigNumber(community.contract.maxClaim)
        .multipliedBy(community.state.beneficiaries)
        .toString();

    const days = estimateCommunityRemainFunds({
        contract: community.contract!,
        state: community.state!,
    });

    if (community.contract === undefined || community.state === undefined) {
        return null;
    }

    const raisedPercentage =
        (
            (parseFloat(community.state.contributed || '0') /
                parseFloat(maxClaim)) *
            100
        ).toFixed(2) + '%';

    return (
        <>
            <View
                style={{
                    marginTop: 7,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Text
                        style={[
                            styles.description,
                            {
                                color: ipctColors.regentGray,
                            },
                        ]}
                    >
                        {i18n.t('generic.raisedFrom', {
                            backers: community.state.contributors,
                        })}{' '}
                        {i18n.t('generic.backers', {
                            count: community.state.contributors,
                        })}
                    </Text>
                    <Text
                        style={[
                            styles.description,
                            {
                                color: ipctColors.regentGray,
                            },
                        ]}
                    >
                        {i18n.t('generic.goal')}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Text style={styles.Text}>
                        {amountToCurrency(
                            community.state.contributed,
                            user.currency,
                            exchangeRates
                        )}
                        {raisedPercentage !== '0.00%' &&
                            community.state.beneficiaries >= 1 &&
                            ` (${raisedPercentage})`}
                    </Text>
                    <Text style={styles.Text}>
                        {amountToCurrency(
                            maxClaim,
                            user.currency,
                            exchangeRates
                        )}
                    </Text>
                </View>
            </View>
            <View style={{ marginTop: 7.5 }}>
                <ProgressBar
                    key="raised"
                    style={{
                        backgroundColor: ipctColors.softGray,
                        position: 'absolute',
                        borderRadius: 6.5,
                        height: 6.32,
                    }}
                    progress={calculateCommunityProgress('raised', community)}
                />
                {days < 5 && (
                    <View
                        style={[
                            styles.fundsContainer,
                            {
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                            },
                        ]}
                    >
                        <WarningTriangle
                            color={ipctColors.warningOrange}
                            style={{
                                marginTop: ipctSpacing.xsmall,
                                alignSelf: 'center',
                            }}
                        />
                        <Text
                            style={[
                                styles.description,
                                {
                                    color: ipctColors.regentGray,
                                    marginLeft: 7,
                                },
                            ]}
                        >
                            {days === 0
                                ? i18n.t('community.fundsRunOut')
                                : i18n.t('community.fundsWillRunOut', {
                                      days: Math.floor(days),
                                      count: Math.floor(days),
                                  })}
                        </Text>
                    </View>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: ipctColors.softGray,
    },
    sphereClaimed: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: ipctColors.greenishTeal,
        marginRight: 5,
    },
    sphereRaised: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: ipctColors.blueRibbon,
        marginRight: 5,
    },
    Text: {
        fontFamily: 'Inter-Bold',
        color: ipctColors.darBlue,
        fontSize: ipctFontSize.small,
        lineHeight: ipctLineHeight.xlarge,
    },
    description: {
        fontFamily: 'Inter-Regular',
        fontSize: ipctFontSize.smaller,
        lineHeight: ipctLineHeight.bigger,
        fontStyle: 'normal',
        fontWeight: '400',
        letterSpacing: 0,
        textAlign: 'left',
    },
    fundsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 22,
        paddingHorizontal: 8,
    },
});
