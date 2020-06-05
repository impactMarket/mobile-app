import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
    ICommunityInfo,
} from '../helpers/types';
import {
    Card,
    Title,
    ProgressBar,
} from 'react-native-paper';
import { calculateCommunityProgress } from '../helpers';
import config from '../config';
import BigNumber from 'bignumber.js';


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
        } = this.props;

        return (
            <Card style={{ marginVertical: 15 }}>
                <Card.Content>
                    <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5, justifyContent: 'center' }}>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <Title style={{ fontSize: 40, fontFamily: 'Gelion-Regular', paddingVertical: 10 }}>{community.beneficiaries.length}</Title>
                            <Text style={{ color: 'grey', fontFamily: 'Gelion-Regular' }}>Beneficiaries</Text>
                        </View>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <Title style={{ fontSize: 40, fontFamily: 'Gelion-Regular', paddingVertical: 10 }}>{community.backers.length}</Title>
                            <Text style={{ color: 'grey', fontFamily: 'Gelion-Regular' }}>Backers</Text>
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
                            color="#50ad53"
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
                        <Text style={{ fontFamily: 'Gelion-Regular' }}>{calculateCommunityProgress('claimedbyraised', community) * 100}% Claimed</Text>
                        <Text style={{ marginLeft: 'auto', fontFamily: 'Gelion-Regular' }}>${new BigNumber(community.totalRaised).div(new BigNumber(10).pow(config.cUSDDecimals)).toFixed(2)} Raised</Text>
                    </View>
                    {this.props.children}
                </Card.Content>
            </Card>
        );
    }
}

export default connector(CommuntyStatus);