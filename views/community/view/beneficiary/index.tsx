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
import { humanifyNumber } from '../../../../helpers';
import Claim from './Claim';


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
                    <Claim />
                    <Text
                        onPress={() => navigation.navigate('ClaimExplainedScreen')}
                        style={{ marginVertical: 15, textAlign: 'center' }}
                    >How claim works?</Text>
                </View>
            </View>
        </ScrollView>
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
        color: 'white'
    },
    communityLocation: {
        fontSize: 20,
        color: 'white'
    },
});

export default connector(BeneficiaryView);