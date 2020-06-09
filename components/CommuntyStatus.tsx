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
import { calculateCommunityProgress, humanifyNumber } from '../helpers';
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

        // in theory, it's the total claimed is relative to the total raised.
        // But to draw the progress bar, it's relative to the progress bar size.
        const claimedByRaised = parseFloat(
            new BigNumber(community.totalClaimed)
                .div(community.totalRaised === '0' ? 1 : community.totalRaised)
                .multipliedBy(100)
                .toFixed(2)
        );

        return (
            <Card style={{ marginVertical: 15 }}>
                <Card.Content>
                    <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5, justifyContent: 'center' }}>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <Title style={{ fontSize: 40, fontFamily: 'Gelion-Regular', paddingVertical: 10 }}>{community.beneficiaries.added.length}</Title>
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
                        <Text style={{ fontFamily: 'Gelion-Regular' }}>{claimedByRaised}% Claimed</Text>
                        <Text style={{ marginLeft: 'auto', fontFamily: 'Gelion-Regular' }}>${humanifyNumber(community.totalRaised)} Raised</Text>
                    </View>
                    {this.props.children}
                </Card.Content>
            </Card>
        );
    }
}

export default connector(CommuntyStatus);