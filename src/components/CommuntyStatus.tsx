import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import {
    calculateCommunityProgress,
    iptcColors,
    amountToUserCurrency,
    getCurrencySymbol,
} from 'helpers/index';
import { IRootState, ICommunityInfo } from 'helpers/types';
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title, ProgressBar } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';

interface ICommuntyStatusProps {
    children?: any; // linter issues are a bit anoying sometimes
    noElevation?: boolean;
    community: ICommunityInfo;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state;
    return { user, network };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ICommuntyStatusProps;

class CommuntyStatus extends Component<Props, object> {
    render() {
        const { community, user, noElevation } = this.props;

        // in theory, it's the total claimed is relative to the total raised.
        // But to draw the progress bar, it's relative to the progress bar size.
        const claimedByRaised = parseFloat(
            new BigNumber(community.totalClaimed)
                .div(community.totalRaised === '0' ? 1 : community.totalRaised)
                .multipliedBy(100)
                .decimalPlaces(2, 1)
                .toString()
        );

        return (
            <Card elevation={noElevation ? 0 : 8} style={{ marginTop: 20 }}>
                <Card.Content>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            marginVertical: 5,
                            justifyContent: 'center',
                        }}
                    >
                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <Title
                                style={{
                                    fontFamily: 'Gelion-Regular',
                                    fontStyle: 'normal',
                                    fontWeight: 'bold',
                                    fontSize: 42,
                                    lineHeight: 42,
                                }}
                            >
                                {community.beneficiaries.added.length}
                            </Title>
                            <Text
                                style={{
                                    color: iptcColors.textGray,
                                    fontFamily: 'Gelion-Regular',
                                    fontSize: 14,
                                    lineHeight: 15,
                                }}
                            >
                                {i18n.t('beneficiaries')}
                            </Text>
                        </View>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <Title
                                style={{
                                    fontFamily: 'Gelion-Regular',
                                    fontStyle: 'normal',
                                    fontWeight: 'bold',
                                    fontSize: 42,
                                    lineHeight: 42,
                                }}
                            >
                                {community.backers.length}
                            </Title>
                            <Text
                                style={{
                                    color: iptcColors.textGray,
                                    fontFamily: 'Gelion-Regular',
                                    fontSize: 14,
                                    lineHeight: 15,
                                }}
                            >
                                {i18n.t('backers')}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <ProgressBar
                            key="raised"
                            style={{
                                marginTop: 10,
                                backgroundColor: '#d6d6d6',
                                position: 'absolute',
                            }}
                            progress={calculateCommunityProgress(
                                'raised',
                                community
                            )}
                            color="#5289ff"
                        />
                        <ProgressBar
                            key="claimed"
                            style={{
                                marginTop: 10,
                                backgroundColor: 'rgba(255,255,255,0)',
                            }}
                            progress={calculateCommunityProgress(
                                'claimed',
                                community
                            )}
                            color={iptcColors.greenishTeal}
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View style={styles.sphereClaimed} />
                            <Text
                                style={{
                                    fontFamily: 'Gelion-Regular',
                                    fontSize: 15,
                                    lineHeight: 14,
                                    letterSpacing: 0.245455,
                                }}
                            >
                                {claimedByRaised}%{' '}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'Gelion-Regular',
                                    color: iptcColors.textGray,
                                    fontSize: 15,
                                    lineHeight: 14,
                                    letterSpacing: 0.245455,
                                }}
                            >
                                {i18n.t('claimed')}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View style={styles.sphereRaised} />
                            <Text
                                style={{
                                    fontFamily: 'Gelion-Regular',
                                    fontSize: 15,
                                    lineHeight: 14,
                                    letterSpacing: 0.245455,
                                }}
                            >
                                {getCurrencySymbol(user.user.currency)}
                                {amountToUserCurrency(
                                    community.totalRaised,
                                    user.user
                                )}{' '}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'Gelion-Regular',
                                    color: iptcColors.textGray,
                                    fontSize: 15,
                                    lineHeight: 14,
                                    letterSpacing: 0.245455,
                                }}
                            >
                                {i18n.t('raised')}
                            </Text>
                        </View>
                    </View>
                    {this.props.children}
                </Card.Content>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    sphereClaimed: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: iptcColors.greenishTeal,
        marginRight: 5,
    },
    sphereRaised: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: iptcColors.softBlue,
        marginRight: 5,
    },
});

export default connector(CommuntyStatus);
