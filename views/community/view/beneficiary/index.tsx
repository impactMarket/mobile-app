import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
} from 'react-native';
import {
    connect,
    ConnectedProps
} from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
    IRootState,
    ICommunityInfo
} from '../../../../helpers/types';
import { getCommunityByContractAddress } from '../../../../services';
import Claim from './Claim';
import { Button, ProgressBar } from 'react-native-paper';
import { iptcColors, humanifyNumber } from '../../../../helpers';
import Header from '../../../../components/Header';
import BigNumber from 'bignumber.js';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function BeneficiaryView(props: Props) {
    const navigation = useNavigation();
    const [community, setCommunity] = useState<ICommunityInfo>();
    const [claimedAmount, setClaimedAmount] = useState(0);
    const [claimedProgress, setClaimedProgress] = useState(0.1);

    useEffect(() => {
        const loadCommunity = async () => {
            if (props.network.contracts.communityContract === undefined) {
                return;
            }
            const { _address } = props.network.contracts.communityContract;
            const _community = await getCommunityByContractAddress(_address);
            if (_community === undefined) {
                // TODO: show error
                return;
            }
            const amount = await props.network.contracts.communityContract
                .methods.claimed(props.user.celoInfo.address).call();

            const progress = new BigNumber(amount.toString()).div(_community.vars._claimHardCap);
            setClaimedAmount(humanifyNumber(amount.toString()));
            setClaimedProgress(progress.toNumber());
            setCommunity(_community);
        }
        loadCommunity();
    }, [props.network.contracts.communityContract]);

    const updateClaimedAmount = async () => {
        const amount = await props.network.contracts.communityContract
            .methods.claimed(props.user.celoInfo.address).call();

        setClaimedAmount(humanifyNumber(amount.toString()));
    }

    // const { isBeneficiary } = this.props.user.community;
    if (community === undefined) {
        return <Text>Loading...</Text>;
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <Header
                title="Claim"
                navigation={navigation}
                hasHelp={true}
                hasShare={true}
            />
            <ImageBackground
                source={{ uri: community.coverImage }}
                resizeMode={'cover'}
                style={styles.imageBackground}
            >
                <Text style={styles.communityName}>{community.name}</Text>
                <Text style={styles.communityLocation}>
                    <AntDesign name="enviromento" size={20} /> {community.city}, {community.country}
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
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    mode="outlined"
                    style={{ margin: 30, height: 35 }}
                    onPress={() => navigation.navigate('CommunityDetailsScreen',
                        { community: community, user: props.user }
                    )}
                >
                    More about your community
                </Button>
                <Claim
                    claimAmount={community.vars._amountByClaim}
                    updateClaimedAmount={updateClaimedAmount}
                />
                <View>
                    <Text
                        onPress={() => navigation.navigate('ClaimExplainedScreen')}
                        style={styles.haveClaimed}
                    >You have claimed ${claimedAmount} out of ${humanifyNumber(community.vars._claimHardCap)}</Text>
                    <ProgressBar
                        key="claimedbybeneficiary"
                        style={{
                            backgroundColor: '#d6d6d6',
                            marginHorizontal: 30,
                            marginVertical: 13
                        }}
                        progress={claimedProgress}
                        color="#5289ff"
                    />
                    <Text
                        onPress={() => navigation.navigate('ClaimExplainedScreen')}
                        style={styles.howClaimsWork}
                    >How claim works?</Text>
                </View>
            </View>
        </View>
    );
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
        height: 200,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    communityName: {
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center'
    },
    communityLocation: {
        fontSize: 20,
        color: 'white'
    },
    howClaimsWork: {
        fontFamily: 'Gelion-Bold',
        fontSize: 18,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0.3,
        textAlign: "center",
        color: iptcColors.softBlue,
        height: 25
    },
    haveClaimed: {
        fontFamily: "Gelion-Regular",
        fontSize: 15,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 14,
        letterSpacing: 0.25,
        textAlign: "center",
        color: "#7e8da6"
    }
});

export default connector(BeneficiaryView);