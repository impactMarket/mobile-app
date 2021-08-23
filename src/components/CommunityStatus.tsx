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
import { View, StyleSheet, Dimensions } from 'react-native';
import { Title, ProgressBar, Text, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

import Card from './core/Card';
import WarningRedTriangle from './svg/WarningRedTriangle';

interface ICommuntyStatusProps {
    children?: any; // linter issues are a bit anoying sometimes
    community: CommunityAttributes;
    goal: BigNumber;
}

export default function CommunityStatus(props: ICommuntyStatusProps) {
    const { community, goal } = props;
    const { width } = Dimensions.get('screen');

    const user = useSelector((state: IRootState) => state.user.metadata);

    const app = useSelector((state: IRootState) => state.app);

    if (community.contract === undefined || community.state === undefined) {
        return null;
    }

    return (
        <Card elevation={0} style={{ marginTop: 16 }}>
            <Card.Content>
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
                                    lineHeight: width < 375 ? 14 : 24,
                                },
                            ]}
                        >
                            {i18n.t('raisedFrom', {
                                backers: community.state.backers,
                            })}
                        </Text>
                        <Title
                            style={[
                                styles.title,
                                {
                                    fontSize: width < 375 ? 14 : 20,
                                },
                            ]}
                        >
                            {amountToCurrency(
                                community.state.raised,
                                user.currency,
                                app.exchangeRates
                            )}
                        </Title>
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
                        <Title
                            style={[
                                styles.title,
                                { fontSize: width < 375 ? 14 : 20 },
                            ]}
                        >
                            {goal
                                ? amountToCurrency(
                                      goal,
                                      user.currency,
                                      app.exchangeRates
                                  )
                                : ' '}
                        </Title>
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
                            marginRight: width < 375 ? 40 : 0,
                            justifyContent: 'center',
                        },
                    ]}
                >
                    {/* TODO: Add a condition to avoid show this message when community is finacial health. */}
                    <WarningRedTriangle
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
                                lineHeight: width < 375 ? 14 : 24,
                            },
                        ]}
                    >
                        {i18n.t('fundsRunOut', {
                            days: calculateCommunityRemainedFunds(community),
                        })}
                    </Text>
                </View>
                {props.children && <Divider />}
                {props.children}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
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
    title: {
        fontFamily: 'Inter-Bold',
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
        justifyContent: 'center',
        marginVertical: 22,
        paddingHorizontal: 8,
    },
});
