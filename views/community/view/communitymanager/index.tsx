import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    RefreshControl,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
    ICommunityInfo,
} from '../../../../helpers/types';
import {
    Button,
    Paragraph,
    Card,
    Title,
    ProgressBar,
} from 'react-native-paper';
import {
    getCommunityByContractAddress,
} from '../../../../services';
import { ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { calculateCommunityProgress } from '../../../../helpers';
import config from '../../../../config';
import BigNumber from 'bignumber.js';
import ListCommunityManagers from './ListCommunityManagers';
import Beneficiaries from './cards/Beneficiaries';


interface ICommunityManagerViewProps {
    navigation: any;
}
interface ICommunityManagerViewState {
    modalListManagers: boolean;
    community?: ICommunityInfo;
    refreshing: boolean;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & ICommunityManagerViewProps

class CommunityManagerView extends React.Component<Props, ICommunityManagerViewState> {

    constructor(props: any) {
        super(props);
        this.state = {
            modalListManagers: false,
            refreshing: true,
        }
    }

    componentDidMount = async () => {
        const { _address } = this.props.network.contracts.communityContract;
        const community = await getCommunityByContractAddress(_address);
        if (community === undefined) {
            // TODO: show error
            return;
        }
        this.setState({ community, refreshing: false });
    }

    onRefresh = () => {
        const { _address } = this.props.network.contracts.communityContract;
        getCommunityByContractAddress(_address).then((community) => {
            if (community !== undefined) {
                this.setState({ community, refreshing: false });
            }
        });
    }

    render() {
        const {
            community,
        } = this.state;
        if (community === undefined) {
            return <View>
                <Paragraph>Loading...</Paragraph>
            </View>
        }

        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }
            >
                <ImageBackground
                    source={{ uri: community.coverImage }}
                    resizeMode={'cover'}
                    style={styles.imageBackground}
                >
                    <Text style={styles.communityName}>{community.name}</Text>
                    <Text style={styles.communityLocation}>
                        <AntDesign name="enviromento" size={20} /> {community.location.title}
                    </Text>
                    <LinearGradient
                        colors={['transparent', 'rgba(246,246,246,1)']}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: 80,
                        }}
                    />
                </ImageBackground>
                <View style={styles.container}>
                    <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet augue justo. In id dolor nec nisi vulputate cursus in a magna. Donec varius elementum ligula, vitae vulputate felis eleifend non. Donec pellentesque convallis congue. Vivamus sed vestibulum turpis, et suscipit lorem. Aenean vehicula pretium sapien.</Paragraph>
                    <View style={{ flex: 1, flexDirection: 'row', marginVertical: 25 }}>
                        <Button
                            mode="outlined"
                            disabled={true}
                            onPress={() => console.log('Pressed')}
                        >
                            Edit
                        </Button>
                        <Button
                            mode="outlined"
                            disabled={true}
                            style={{ marginLeft: 'auto' }}
                            onPress={() => console.log('Pressed')}
                        >
                            More...
                        </Button>
                    </View>
                    <Beneficiaries
                        community={community}
                        updateCommunity={(community) => this.setState({ community })}
                    />
                    <Card style={{ marginVertical: 15 }}>
                        <Card.Title
                            title=""
                            style={{ backgroundColor: '#f0f0f0' }}
                            subtitleStyle={{ color: 'grey' }}
                            subtitle="COMMUNITY LEADERS"
                        />
                        <Card.Content>
                            <ListCommunityManagers
                                managers={community.managers}
                            />
                            <Button
                                mode="outlined"
                                style={{ width: '100%' }}
                                disabled={true}
                                onPress={() => console.log('Pressed')}
                            >
                                Add Community Leader
                            </Button>
                        </Card.Content>
                    </Card>
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
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 20
    },
    imageBackground: {
        width: '100%',
        height: 180,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    communityName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    communityLocation: {
        fontSize: 20,
        color: 'white'
    },
});

export default connector(CommunityManagerView);