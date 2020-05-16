import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Text,
    ImageBackground,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import {
    IRootState,
    IBeneficiary,
    ICommunity,
    ICommunityViewInfo,
} from '../../../helpers/types';
import {
    Button,
    List,
    Portal,
    Dialog,
    Paragraph,
    Card,
    Subheading,
    Title,
    ProgressBar
} from 'react-native-paper';
import {
    getBeneficiariesRequestByCommunity,
    getCommunityByContractAddress,
    celoWalletRequest,
    acceptBeneficiaryRequest
} from '../../../services';
import { getBeneficiariesByCommunity } from '../../../services/api';
import { ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarCodeScanner } from 'expo-barcode-scanner';


interface ICommunityManagerViewProps {
    navigation: any;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & ICommunityManagerViewProps
interface ICommunityManagerViewState {
    newBeneficiaryAddress: string;
    beneficiaries: IBeneficiary[];
    modalNewBeneficiary: boolean;
    requestConfirmation?: IBeneficiary;
    community?: ICommunityViewInfo;
    hasPermission: boolean;
    scanned: boolean;
}
class CommunityManagerView extends React.Component<Props, ICommunityManagerViewState> {

    constructor(props: any) {
        super(props);
        this.state = {
            newBeneficiaryAddress: '',
            beneficiaries: [],
            modalNewBeneficiary: false,
            hasPermission: false,
            scanned: false,
        }
    }

    componentDidMount = async () => {
        const { _address } = this.props.network.contracts.communityContract;
        getCommunityByContractAddress(
            _address,
        ).then(async (community) => {
            if (community === undefined) {
                // TODO: show error
                return;
            }
            getBeneficiariesByCommunity(community.contractAddress)
                .then((beneficiaries) => this.setState({ beneficiaries }))

            const stableToken = await this.props.network.kit.contracts.getStableToken();
            const [cUSDBalanceBig, cUSDDecimals] = await Promise.all(
                [stableToken.balanceOf(_address), stableToken.decimals()]
            )
            let cUSDBalance = cUSDBalanceBig.div(10 ** cUSDDecimals).toFixed(2)

            const _community: ICommunityViewInfo = {
                ...community,
                backers: 5,
                beneficiaries: 8,
                ubiRate: 1,
                totalClaimed: 0.2,
                totalRaised: parseFloat(cUSDBalance),
            }
            this.setState({ community: _community });
        });
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        this.setState({ hasPermission: status === 'granted' });
    }

    handleAddBeneficiary = async () => {
        const { newBeneficiaryAddress, community } = this.state;
        const { user, network } = this.props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;

        if (communityContract === undefined) {
            // TODO: do something beatiful, la la la
            return;
        }

        // TODO: validate newBeneficiaryAddress

        celoWalletRequest(
            address,
            communityContract.options.address,
            await communityContract.methods.addBeneficiary(newBeneficiaryAddress),
            'accept_beneficiary_request',
            network,
        ).then(() => {
            Alert.alert(
                'Success',
                'You\'ve accepted the beneficiary request!',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }).catch(() => {
            Alert.alert(
                'Failure',
                'An error happened while accepting the request!',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );

        }).finally(() => {
            this.setState({ modalNewBeneficiary: false })
        });
    }

    handleBarCodeScanned = ({ type, data }: { type: any, data: any }) => {
        this.setState({ scanned: true, newBeneficiaryAddress: data });
    };

    render() {
        const {
            newBeneficiaryAddress,
            modalNewBeneficiary,
            requestConfirmation,
            beneficiaries,
            community,
            hasPermission,
            scanned,
        } = this.state;
        if (community === undefined) {
            return <View>
                <Paragraph>Loading...</Paragraph>
            </View>
        }

        if (hasPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        }
        if (hasPermission === false) {
            return <Text>No access to camera</Text>;
        }

        return (
            <ScrollView>
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
                            onPress={() => console.log('Pressed')}
                        >
                            Edit
                        </Button>
                        <Button
                            mode="outlined"
                            style={{ marginLeft: 'auto' }}
                            onPress={() => console.log('Pressed')}
                        >
                            More...
                        </Button>
                    </View>
                    <Card>
                        <Card.Title
                            title=""
                            style={{ backgroundColor: '#f0f0f0' }}
                            subtitleStyle={{ color: 'grey' }}
                            subtitle="BENEFICIARIES"
                        />
                        <Card.Content>
                            <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
                                <Subheading>Pending</Subheading>
                                <Button
                                    mode="contained"
                                    style={{ marginLeft: 'auto' }}
                                    onPress={() => console.log('Pressed')}
                                >
                                    4
                                </Button>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
                                <Subheading>Accepted</Subheading>
                                <Button
                                    mode="contained"
                                    style={{ marginLeft: 'auto' }}
                                    onPress={() => console.log('Pressed')}
                                >
                                    45
                                </Button>
                            </View>
                            <Button
                                mode="outlined"
                                style={{ width: '100%' }}
                                onPress={() => this.setState({ modalNewBeneficiary: true })}
                            >
                                Add Beneficiary
                            </Button>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginVertical: 15 }}>
                        <Card.Title
                            title=""
                            style={{ backgroundColor: '#f0f0f0' }}
                            subtitleStyle={{ color: 'grey' }}
                            subtitle="COMMUNITY LEADERS"
                        />
                        <Card.Content>
                            <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
                                <Subheading>Active</Subheading>
                                <Button
                                    mode="contained"
                                    style={{ marginLeft: 'auto' }}
                                    onPress={() => console.log('Pressed')}
                                >
                                    2
                                </Button>
                            </View>
                            <Button
                                mode="outlined"
                                style={{ width: '100%' }}
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
                                    <Title style={{ fontSize: 40, paddingVertical: 10 }}>{community.beneficiaries}</Title>
                                    <Text style={{ color: 'grey' }}>Beneficiaries</Text>
                                </View>
                                <View style={{ width: '50%', alignItems: 'center' }}>
                                    <Title style={{ fontSize: 40, paddingVertical: 10 }}>{community.backers}</Title>
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
                                    progress={community.totalRaised}
                                    color="#5289ff"
                                />
                                <ProgressBar
                                    key="claimed"
                                    style={{
                                        marginTop: 10,
                                        backgroundColor: 'rgba(255,255,255,0)'
                                    }}
                                    progress={community.totalClaimed}
                                    color="#50ad53"
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
                                <Text>37% Claimed</Text>
                                <Text style={{ marginLeft: 'auto' }}>${community.totalRaised} Raised</Text>
                            </View>
                            <Button
                                mode="outlined"
                                style={{ width: '100%' }}
                                onPress={() => console.log('Pressed')}
                            >
                                Full Dashboard
                            </Button>
                        </Card.Content>
                    </Card>
                    {/* <View>
                        <Paragraph>contractAddress {community.contractAddress}</Paragraph>
                        <Paragraph>createdAt {community.createdAt}</Paragraph>
                        <Paragraph>description {community.description}</Paragraph>
                        <Paragraph>location {community.location.title}</Paragraph>
                        <Paragraph>name {community.name}</Paragraph>
                    </View>
                    <List.Section>
                        <List.Subheader>Pending requests</List.Subheader>
                        {beneficiaryRequests.map((request) =>
                            <List.Item
                                key={request.walletAddress}
                                title={request.walletAddress}
                                description={request.createdAt}
                                onPress={() => this.setState({ requestConfirmation: request, modalNewBeneficiary: true })}
                            />
                        )}
                    </List.Section>
                    <List.Section>
                        <List.Subheader>Community Beneficiaries</List.Subheader>
                        {beneficiaries.map((request) =>
                            <List.Item
                                key={request.walletAddress}
                                title={request.walletAddress}
                                description={request.createdAt}
                            />
                        )}
                    </List.Section> */}
                </View>
                <Portal>
                    <Dialog
                        visible={modalNewBeneficiary}
                        onDismiss={() => this.setState({ modalNewBeneficiary: false })}
                    >
                        <Dialog.Title>Confirmation</Dialog.Title>
                        <Dialog.Content style={{ height: 350, width: '100%' }}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                }}>

                                <BarCodeScanner
                                    onBarCodeScanned={this.handleBarCodeScanned}
                                    style={StyleSheet.absoluteFillObject}
                                />

                                {scanned && <Button onPress={() => this.setState({ scanned: false })}>Tap to Scan Again</Button>}
                            </View>
                            <Paragraph>Current scanned address:</Paragraph>
                            <Paragraph style={{ fontWeight: 'bold' }}>{newBeneficiaryAddress}</Paragraph>
                            <Paragraph>Click Add to add as beneficiary</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                mode="contained"
                                disabled={newBeneficiaryAddress.length === 0}
                                style={{ marginRight: 10 }}
                                onPress={this.handleAddBeneficiary}
                            >
                                Add
                                </Button>
                            <Button
                                mode="contained"
                                onPress={() => this.setState({
                                    modalNewBeneficiary: false,
                                    newBeneficiaryAddress: ''
                                })}
                            >
                                Cancel
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
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