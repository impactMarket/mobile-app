import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState, ICommunityInfo } from '../../../../helpers/types';

import { Button } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { setUserFirstTime } from '../../../../helpers/redux/actions/ReduxActions';
import { CommunityInstance } from '../../../../contracts/types/truffle-contracts';
import { ethers } from 'ethers';
import { LinearGradient } from 'expo-linear-gradient';
import { celoWalletRequest, getCommunityByContractAddress } from '../../../../services';
import { ScrollView } from 'react-native-gesture-handler';
import { humanifyNumber } from '../../../../helpers';


interface IBeneficiaryViewProps {
    navigation: any;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IBeneficiaryViewProps
interface IBeneficiaryViewState {
    nextClaim: number;
    claimDisabled: boolean;
    loading: boolean;
    loaded: boolean;
    claiming: boolean;
    loggedIn: boolean;
    community?: ICommunityInfo;
}
class BeneficiaryView extends React.Component<Props, IBeneficiaryViewState> {

    constructor(props: any) {
        super(props);
        this.state = {
            nextClaim: 0,
            claimDisabled: true,
            loading: false,
            loaded: false,
            claiming: false,
            loggedIn: false,
        }
    }

    loadPage = async (props: Readonly<Props>) => {
        const communityContract = props.network.contracts.communityContract;
        if (props.network.contracts.communityContract !== undefined) {
            await this._loadAllowance(communityContract);
            this.setState({ loading: false, loggedIn: true, loaded: true });
        } else if (props.user.celoInfo.address.length === 0) {
            this.setState({ loading: false, loggedIn: false, loaded: true });
        }

        getCommunityByContractAddress(
            this.props.network.contracts.communityContract._address,
        ).then((community) => {
            if (community === undefined) {
                // TODO: show error
                return;
            }
            this.setState({ community });
        });
        // TODO: load current beneficiaries from a community
    }

    // TODO: improve
    componentDidMount = async () => {
        if (!this.state.loaded && !this.state.loading) {
            this.setState({ loading: true });
            await this.loadPage(this.props);
        }
    }

    // TODO: improve
    UNSAFE_componentWillUpdate = async (nextProps: Readonly<Props>, nextState: Readonly<IBeneficiaryViewState>, nextContext: any) => {
        if (!this.state.loaded && !this.state.loading) {
            this.setState({ loading: true });
            await this.loadPage(nextProps);
        }
    }

    handleClaimPress = async () => {
        const { user, network } = this.props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;

        if (communityContract === undefined) {
            // TODO: do something beatiful, la la la
            return;
        }
        this.setState({ claiming: true });
        celoWalletRequest(
            address,
            communityContract.options.address,
            await communityContract.methods.claim(),
            'user_claim',
            network,
        ).then((result) => {
            this._loadAllowance(communityContract).then(() => {
                this.setState({ claiming: false });
            })
        })
    }

    render() {
        const {
            claimDisabled,
            nextClaim,
            loading,
            claiming,
            loggedIn,
            community
        } = this.state;
        // const { isBeneficiary } = this.props.user.community;
        if (loading || community === undefined) {
            return <Text>Loading...</Text>;
        }
        if (!loggedIn) {
            return <>
                <Text>Login needed...</Text>
                <Button
                    mode="contained"
                    onPress={() => this.props.dispatch(setUserFirstTime(true))}
                >
                    Login now
                </Button>
            </>;
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
                <View>
                    <Text style={styles.mainPageContent}>
                        Every day you can claim ${humanifyNumber(community.vars._amountByClaim)} up to a total of ${humanifyNumber(community.vars._claimHardCap)}
                    </Text>
                    <View style={styles.container}>
                        <Button
                            mode="contained"
                            onPress={this.handleClaimPress}
                            disabled={claimDisabled}
                            loading={claiming}
                        >
                            {claimDisabled ? new Date(nextClaim).toLocaleString() : 'Claim'}
                        </Button>
                        <Text
                            onPress={() => this.props.navigation.navigate('ClaimExplainedScreen')}
                            style={{ marginVertical: 15, textAlign: 'center' }}
                        >How claim works?</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }

    _loadAllowance = async (communityInstance: ethers.Contract & CommunityInstance) => {
        const { address } = this.props.user.celoInfo;
        const cooldownTime = parseInt((await communityInstance.methods.cooldownClaim(address).call()).toString(), 10);
        const claimDisabled = cooldownTime * 1000 > new Date().getTime()
        const remainingCooldown = cooldownTime * 1000 - new Date().getTime();
        // if timeout is bigger than 3 minutes, ignore!
        if (claimDisabled && remainingCooldown < 90000) {
            setTimeout(() => {
                this.setState({ claimDisabled: false });
            }, remainingCooldown);
        }
        this.setState({
            claimDisabled,
            nextClaim: cooldownTime * 1000,
            loading: false,
        })
    }
}

const styles = StyleSheet.create({
    mainPageContent: {
        fontSize: 30,
        marginVertical: 30,
        marginHorizontal: '20%',
        width: '50%',
        textAlign: 'center',
    },
    container: {
        margin: 20
    },
    imageBackground: {
        width: '100%',
        height: 250,
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

export default connector(BeneficiaryView);