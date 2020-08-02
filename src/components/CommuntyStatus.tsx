import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
    ICommunityInfo,
} from 'helpers/types';
import {
    Card,
    Title,
    ProgressBar,
} from 'react-native-paper';
import {
    calculateCommunityProgress,
    iptcColors,
    amountToUserCurrency,
    getUserCurrencySymbol
} from 'helpers/index';
import BigNumber from 'bignumber.js';
import i18n from 'assets/i18n';


interface ICommuntyStatusProps {
    children?: any; // linter issues are a bit anoying sometimes
    community: ICommunityInfo;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & ICommuntyStatusProps

class CommuntyStatus extends Component<Props, {}> {

    render() {
        const {
            community,
            user,
        } = this.props;

        // in theory, it's the total claimed is relative to the total raised.
        // But to draw the progress bar, it's relative to the progress bar size.
        const claimedByRaised = parseFloat(
            new BigNumber(community.totalClaimed)
                .div(community.totalRaised === '0' ? 1 : community.totalRaised)
                .multipliedBy(100)
                .toFixed(2)
        );

        return (
            <Card elevation={8} style={{ marginVertical: 15 }}>
                <Card.Content>
                    <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5, justifyContent: 'center' }}>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <Title style={{ fontSize: 40, fontFamily: 'Gelion-Regular', paddingVertical: 10 }}>{community.beneficiaries.added.length}</Title>
                            <Text style={{ color: 'grey', fontFamily: 'Gelion-Regular' }}>{i18n.t('beneficiaries')}</Text>
                        </View>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <Title style={{ fontSize: 40, fontFamily: 'Gelion-Regular', paddingVertical: 10 }}>{community.backers.length}</Title>
                            <Text style={{ color: 'grey', fontFamily: 'Gelion-Regular' }}>{i18n.t('backers')}</Text>
                        </View>
                    </View>
                    <View>
                        <ProgressBar
                            key="raised"
                            style={{
                                marginTop: 10,
                                backgroundColor: '#d6d6d6',
                                position: 'absolute'
                            }}
                            progress={calculateCommunityProgress('raised', community)}
                            color="#5289ff"
                        />
                        <ProgressBar
                            key="claimed"
                            style={{
                                marginTop: 10,
                                backgroundColor: 'rgba(255,255,255,0)'
                            }}
                            progress={calculateCommunityProgress('claimed', community)}
                            color={iptcColors.greenishTeal}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.sphereClaimed}></View>
                            <Text style={{ fontFamily: 'Gelion-Regular' }}>{claimedByRaised}% {i18n.t('claimed')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.sphereRaised}></View>
                            <Text style={{ fontFamily: 'Gelion-Regular' }}>
                                {getUserCurrencySymbol(user.user)}
                                {amountToUserCurrency(community.totalRaised, user.user)} {i18n.t('raised')}
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
        marginRight: 5
    },
    sphereRaised: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: iptcColors.softBlue,
        marginRight: 5
    },
});

export default connector(CommuntyStatus);