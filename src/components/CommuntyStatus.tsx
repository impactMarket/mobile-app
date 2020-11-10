import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import { calculateCommunityProgress } from 'helpers/index';
import { amountToCurrency } from 'helpers/currency';
import { iptcColors } from 'styles/index';
import { IRootState, ICommunityInfo } from 'helpers/types';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, ProgressBar, Text } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import Card from './core/Card';

interface ICommuntyStatusProps {
    children?: any; // linter issues are a bit anoying sometimes
    community: ICommunityInfo;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network, app } = state;
    return { user, network, app };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ICommuntyStatusProps;

class CommuntyStatus extends Component<Props, object> {
    render() {
        const { community, user, app } = this.props;

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
            <Card elevation={0} style={{ marginTop: 16 }}>
                <Card.Content>
                    <View
                        style={{
                            flex: 2,
                            flexDirection: 'row',
                            marginTop: 7,
                            justifyContent: 'center',
                            // backgroundColor: 'yellow',
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                            }}
                        >
                            <Title
                                style={{
                                    fontFamily: 'Gelion-Bold',
                                    fontSize: 42,
                                    lineHeight: 42,
                                    marginVertical: 4,
                                }}
                            >
                                {community.beneficiaries.added.length}
                            </Title>
                            <Text
                                style={{
                                    color: iptcColors.textGray,
                                    fontSize: 14,
                                    lineHeight: 15,
                                }}
                            >
                                {i18n.t('beneficiaries')}
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                            }}
                        >
                            <Title
                                style={{
                                    fontFamily: 'Gelion-Bold',
                                    fontSize: 42,
                                    lineHeight: 42,
                                    marginVertical: 4,
                                }}
                            >
                                {community.backers.length}
                            </Title>
                            <Text
                                style={{
                                    color: iptcColors.textGray,
                                    fontSize: 14,
                                    lineHeight: 15,
                                }}
                            >
                                {i18n.t('backers')}
                            </Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 21 }}>
                        <ProgressBar
                            key="raised"
                            style={{
                                backgroundColor: '#d6d6d6', // gray
                                position: 'absolute',
                                borderRadius: 6.5,
                                height: 6.32,
                            }}
                            progress={calculateCommunityProgress(
                                'raised',
                                community
                            )}
                            color={iptcColors.softBlue}
                        />
                        <ProgressBar
                            key="claimed"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0)', // transparent
                                borderRadius: 6.5,
                                height: 6.32,
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
                            paddingVertical: 10,
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
                                    fontFamily: 'Gelion-Bold',
                                    color: iptcColors.almostBlack,
                                    fontSize: 15,
                                    lineHeight: 15,
                                    letterSpacing: 0.245455,
                                }}
                            >
                                {claimedByRaised}%{' '}
                            </Text>
                            <Text
                                style={{
                                    color: iptcColors.textGray,
                                    fontSize: 15,
                                    lineHeight: 15,
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
                                    fontFamily: 'Gelion-Bold',
                                    color: iptcColors.almostBlack,
                                    fontSize: 15,
                                    lineHeight: 15,
                                    letterSpacing: 0.245455,
                                }}
                            >
                                {amountToCurrency(
                                    community.totalRaised,
                                    user.user.currency,
                                    app.exchangeRates
                                )}{' '}
                            </Text>
                            <Text
                                style={{
                                    color: iptcColors.textGray,
                                    fontSize: 15,
                                    lineHeight: 15,
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
