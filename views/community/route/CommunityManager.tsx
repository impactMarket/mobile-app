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
    ICommunityViewInfo,
} from '../../../helpers/types';
import {
    Button,
    Portal,
    Dialog,
    Paragraph,
    Card,
    Subheading,
    Title,
    ProgressBar,
    List
} from 'react-native-paper';
import {
    getCommunityByContractAddress,
    celoWalletRequest,
    getBeneficiariesInCommunity,
    getCommunityManagersInCommunity,
    getCommunityRaisedAmount,
    getCommunityClaimedAmount,
    getBackersInCommunity,
    getCommunityVars,
} from '../../../services';
import { ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { calculateCommunityProgress } from '../../../helpers';


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
    modalNewBeneficiary: boolean;
    modalListBeneficiary: boolean;
    modalListManagers: boolean;
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
            modalNewBeneficiary: false,
            modalListBeneficiary: false,
            modalListManagers: false,
            hasPermission: false,
            scanned: false,
        }
    }

    componentDidMount = async () => {
        const { _address } = this.props.network.contracts.communityContract;
        const community = await getCommunityByContractAddress(_address);
        if (community === undefined) {
            // TODO: show error
            return;
        }
        const beneficiaries = await getBeneficiariesInCommunity(_address);
        const managers = await getCommunityManagersInCommunity(_address);
        const backers = await getBackersInCommunity(_address);
        const vars = await getCommunityVars(_address);

        const claimed = await getCommunityClaimedAmount(_address);
        const raised = await getCommunityRaisedAmount(_address);

        const _community: ICommunityViewInfo = {
            ...community,
            backers,
            beneficiaries,
            managers,
            ubiRate: 1,
            totalClaimed: claimed,
            totalRaised: raised,
            vars,
        }
        this.setState({ community: _community });
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

            // TODO: update UI
            setTimeout(() => {
                const { _address } = this.props.network.contracts.communityContract;
                getBeneficiariesInCommunity(_address)
                    .then((beneficiaries) => this.setState({ community: { ...this.state.community!, beneficiaries } }));
            }, 10000);

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
            modalListBeneficiary,
            modalListManagers,
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
                    <Card>
                        <Card.Title
                            title=""
                            style={{ backgroundColor: '#f0f0f0' }}
                            subtitleStyle={{ color: 'grey' }}
                            subtitle="BENEFICIARIES"
                        />
                        <Card.Content>
                            <View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
                                <Subheading>Accepted</Subheading>
                                <Button
                                    mode="contained"
                                    disabled={community.beneficiaries.length === 0}
                                    style={{ marginLeft: 'auto' }}
                                    onPress={() => this.setState({ modalListBeneficiary: true })}
                                >
                                    {community.beneficiaries.length}
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
                                    onPress={() => this.setState({ modalListManagers: true })}
                                >
                                    {community.managers.length}
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
                                <Text style={{ marginLeft: 'auto' }}>${community.totalRaised.toString()} Raised</Text>
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
                    <Dialog
                        visible={modalListBeneficiary}
                        onDismiss={() => this.setState({ modalListBeneficiary: false })}
                    >
                        <Dialog.Title>Beneficiaries</Dialog.Title>
                        <Dialog.Content>
                            {community.beneficiaries.map((beneficiary) => <List.Item
                                key={beneficiary}
                                title="User Name"
                                description={`${beneficiary.slice(0, 12)}..${beneficiary.slice(31, 42)}`}
                            />)}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                mode="contained"
                                onPress={() => this.setState({
                                    modalListBeneficiary: false
                                })}
                            >
                                Close
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog
                        visible={modalListManagers}
                        onDismiss={() => this.setState({ modalListManagers: false })}
                    >
                        <Dialog.Title>Managers</Dialog.Title>
                        <Dialog.Content>
                            {community.managers.map((manager) => <List.Item
                                key={manager}
                                title="User Name"
                                description={`${manager.slice(0, 12)}..${manager.slice(31, 42)}`}
                            />)}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                mode="contained"
                                onPress={() => this.setState({
                                    modalListManagers: false
                                })}
                            >
                                Close
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