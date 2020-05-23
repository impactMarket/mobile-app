import React from 'react';
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
} from '../../../../../helpers/types';
import {
    Button,
    Card,
    Title,
    ProgressBar,
} from 'react-native-paper';
import { calculateCommunityProgress } from '../../../../../helpers';
import config from '../../../../../config';
import BigNumber from 'bignumber.js';


interface IStatusProps {
    community: ICommunityInfo;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IStatusProps

class Status extends React.Component<Props, {}> {

    render() {
        const {
            community,
        } = this.props;

        return (
            <Card style={{ marginVertical: 15 }}>
                <Card.Content>
                    <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5, justifyContent: 'center' }}>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <Title style={{ fontSize: 40, paddingVertical: 10 }}>{community.beneficiaries.length}</Title>
                            <Text style={{ color: 'grey' }}>Beneficiaries</Text>
                        </View>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <Title style={{ fontSize: 40, paddingVertical: 10 }}>{community.backers.length}</Title>
                            <Text style={{ color: 'grey' }}>Backers</Text>
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
                        <Text>{calculateCommunityProgress('claimed', community) * 100}% Claimed</Text>
                        <Text style={{ marginLeft: 'auto' }}>${new BigNumber(community.totalRaised).div(new BigNumber(10).pow(config.cUSDDecimals)).toFixed(2)} Raised</Text>
                    </View>
                    <Button
                        mode="outlined"
                        disabled={true}
                        style={{ width: '100%' }}
                        onPress={() => console.log('Pressed')}
                    >
                        Full Dashboard
                    </Button>
                </Card.Content>
            </Card>
        );
    }
}

export default connector(Status);