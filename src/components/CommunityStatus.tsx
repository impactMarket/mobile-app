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
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

import SuspiciousCard from './SuspiciousCard';
import Card from './core/Card';
import WarningTriangle from './svg/WarningTriangle';

interface ICommuntyStatusProps {
    children?: any; // linter issues are a bit anoying sometimes
    community: CommunityAttributes;
}

export default function CommunityStatus(props: ICommuntyStatusProps) {
    const { community } = props;
    const { width } = Dimensions.get('screen');
    const user = useSelector((state: IRootState) => state.user.metadata);

    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );

    const goal = new BigNumber(community.contract.maxClaim).multipliedBy(
        community.state.beneficiaries
    );
    const days = calculateCommunityRemainedFunds(community);

    if (community.contract === undefined || community.state === undefined) {
        return null;
    }

    return (
        <Card elevation={0} style={{ marginTop: 16 }}>
            {community.suspect !== undefined && community.suspect !== null && (
                <SuspiciousCard suspectCounts={community.suspect.suspect} />
            )}
            <View style={{ padding: 22 }}>
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
                                    fontSize: width < 375 ? 11 : 14,
                                    lineHeight: width < 375 ? 19 : 24,
                                },
                            ]}
                        >
                            {i18n.t('raisedFrom')}

                            {i18n.t('generic.backers', {
                                count: community.state.backers,
                            })}
                        </Text>
                        <Text
                            style={[
                                styles.Text,
                                {
                                    fontSize: width < 375 ? 14 : 20,
                                },
                            ]}
                        >
                            {amountToCurrency(
                                community.state.raised,
                                user.currency,
                                exchangeRates
                            )}
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
                                    fontSize: width < 375 ? 11 : 14,
                                },
                            ]}
                        >
                            {i18n.t('goal')}
                        </Text>
                        <Text
                            style={[
                                styles.Text,
                                { fontSize: width < 375 ? 14 : 20 },
                            ]}
                        >
                            {goal
                                ? amountToCurrency(
                                      goal,
                                      user.currency,
                                      exchangeRates
                                  )
                                : 'N/A'}
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
                        progress={calculateCommunityProgress(
                            'raised',
                            community
                        )}
                        color={ipctColors.blueRibbon}
                    />
                </View>
                <View
                    style={[
                        styles.fundsContainer,
                        {
                            alignItems: width < 375 ? 'flex-start' : 'center',
                            justifyContent: 'center',
                        },
                    ]}
                >
                    {/* TODO: Add a condition to avoid show this message when community is finacial health. */}
                    <WarningTriangle
                        color="#FE9A22"
                        style={{ marginTop: width < 375 ? 8 : 0 }}
                    />
                    <Text
                        style={[
                            styles.description,
                            {
                                color: ipctColors.regentGray,
                                marginLeft: 7,
                                fontSize: width < 375 ? 11 : 14,
                                lineHeight: width < 375 ? 19 : 24,
                            },
                        ]}
                    >
                        {i18n.t('fundsRunOut', {
                            days,
                        })}{' '}
                        {i18n.t('createCommunity.days', {
                            count: days,
                        })}
                    </Text>
                </View>
                {props.children && <View style={styles.divider} />}
                {props.children}
            </View>
        </Card>
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
        fontSize: 20,
        lineHeight: 32,
    },
    description: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 24,
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
