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
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import {
    IRootState,
    ICommunityInfo
} from '../../../../helpers/types';
import { getCommunityByContractAddress } from '../../../../services';
import Claim from './Claim';
import { Button } from 'react-native-paper';
import { iptcColors } from '../../../../helpers';
import Header from '../../../../components/Header';


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

    useEffect(() => {
        const loadCommunity = async () => {
            const { _address } = props.network.contracts.communityContract;
            const _community = await getCommunityByContractAddress(_address);
            if (_community === undefined) {
                // TODO: show error
                return;
            }
            setCommunity(_community);
        }
        loadCommunity();
    }, []);


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
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Button
                    mode="contained"
                    style={{ margin: 30, height: 35 }}
                    disabled={true}
                >
                    More about your community
                </Button>
                <Claim
                    claimAmount={community.vars._amountByClaim}
                />
                <Text
                    onPress={() => navigation.navigate('ClaimExplainedScreen')}
                    style={styles.howClaimsWork}
                >How claim works?</Text>
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
        height: 250,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    communityName: {
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Gelion-Bold',
        color: 'white'
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
});

export default connector(BeneficiaryView);