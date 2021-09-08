import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import { amountToCurrency } from 'helpers/currency';
import {
    calculateCommunityProgress,
    calculateCommunityRemainedFunds,
} from 'helpers/index';
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

import SuspiciousCard from './SuspiciousCard';
import WarningTriangle from './svg/WarningTriangle';

interface ICommuntyStatusProps {
    children?: any; // linter issues are a bit anoying sometimes
    community: CommunityAttributes;
}

export default function CommunityStatus(props: ICommuntyStatusProps) {
    const { community } = props;
    const user = useSelector((state: IRootState) => state.user.metadata);

    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );

    const maxClaim = new BigNumber(community.contract.maxClaim);
    const maxClaimPerCommunity = maxClaim
        .multipliedBy(community.state.beneficiaries)
        .toString();

    const humanizedValue = (amount: BigNumber | string): string => {
        return amountToCurrency(amount, user.currency, exchangeRates);
    };

    const days = calculateCommunityRemainedFunds(community);

    if (community.contract === undefined || community.state === undefined) {
        return null;
    }

    const raisedPercentage =
        (
            (parseFloat(community.state.raised) /
                parseFloat(maxClaimPerCommunity)) *
            100
        ).toFixed(2) + '%';

    return (
        <>
            {community.suspect !== undefined && community.suspect !== null && (
                <SuspiciousCard suspectCounts={community.suspect.suspect} />
            )}
            <View style={styles.cardWrap}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
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
                            backers: community.state.backers,
                        })}{' '}
                        {i18n.t('generic.backers', {
                            count: community.state.backers,
                        })}
                    </Text>
                    <Text style={styles.Text}>
                        {humanizedValue(community.state.raised) ?? 0}
                        {raisedPercentage !== '0.00%' &&
                            community.state.beneficiaries >= 1 &&
                            ` (${raisedPercentage})`}
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        justifyContent: 'center',
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
                        {i18n.t('generic.goal')}
                    </Text>
                    <Text style={styles.Text}>
                        {humanizedValue(maxClaimPerCommunity) ?? 'N/A'}
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
                {Number(days) < 5 && (
                    <View
                        style={[
                            styles.fundsContainer,
                            {
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                            },
                        ]}
                    >
                        {/* TODO: Add a condition to avoid show this message when community is finacial health. */}
                        <WarningTriangle
                            color="#FE9A22"
                            style={{ marginTop: ipctSpacing.xsmall }}
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
                            {i18n.t('community.fundsRunOut', {
                                days: Math.round(Number(days)),
                            })}{' '}
                            {i18n.t('generic.days', {
                                count: Number(days),
                            })}
                        </Text>
                    </View>
                )}
                {props.children && <View style={styles.divider} />}
                {props.children}
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
    cardWrap: {
        flex: 2,
        flexDirection: 'row',
        marginTop: 7,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    fundsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 22,
        paddingHorizontal: 8,
    },
});
