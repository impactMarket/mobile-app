import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    ScrollView,
} from 'react-native';
import {
    connect,
    ConnectedProps,
} from 'react-redux';
import {
    IRootState,
    ICommunityInfo,
} from '../../helpers/types';
import {
    Card,
    ProgressBar,
    Button,
} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { getAllValidCommunities } from '../../services';
import { useNavigation } from '@react-navigation/native';
import {
    calculateCommunityProgress,
    claimFrequencyToText,
    humanifyNumber
} from '../../helpers';
import Header from '../../components/Header';


interface ICommunitiesScreenProps {
    navigation: any;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & ICommunitiesScreenProps
function CommunitiesScreen(props: Props) {
    const navigation = useNavigation();
    const [communities, setCommunities] = useState<ICommunityInfo[]>([]);

    useEffect(() => {
        const loadCommunities = () => {
            getAllValidCommunities().then(setCommunities);
        }
        loadCommunities();
    }, []);

    return (
        <>
            <Header
                title="Communities"
                navigation={navigation}
            >
                <Button
                    mode="text"
                    onPress={() => navigation.navigate('CreateCommunityScreen')}
                >
                    Create
                </Button>
            </Header>
            <ScrollView style={styles.scrollView}>
                {communities.map((community) => <Card
                    key={community.name}
                    elevation={1}
                    style={styles.card}
                    onPress={() => navigation.navigate('CommunityDetailsScreen', { community: community, user: props.user })}
                >
                    {/* <Card.Cover
                            source={{ uri: community.image }}
                        /> */}
                    <Card.Content style={{ margin: -16 }}>
                        <ImageBackground
                            source={{ uri: community.coverImage }}
                            resizeMode={'cover'}
                            style={{
                                borderRadius: 40,
                                width: '100%',
                                height: 180,
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 25,
                                    fontWeight: 'bold',
                                    fontFamily: 'Gelion-Bold',
                                    color: 'white',
                                    textAlign: 'center'
                                }}
                            >{community.name}</Text>
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: 'white'
                                }}
                            ><AntDesign name="enviromento" size={20} /> {community.city}, {community.country}</Text>
                        </ImageBackground>
                        <View style={{ margin: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                <View>
                                    <Text style={styles.cellHeader}>{community.beneficiaries.added.length}</Text>
                                    <Text style={styles.cellDescription}>Beneficiaries</Text>
                                </View>
                                <View>
                                    <Text style={styles.cellHeader}>${humanifyNumber(community.vars._amountByClaim)}</Text>
                                    <Text style={styles.cellDescription}>{claimFrequencyToText(community.vars._baseIntervalTime)}</Text>
                                </View>
                                <View>
                                    <Text style={styles.cellHeader}>{community.backers.length}</Text>
                                    <Text style={styles.cellDescription}>Backers</Text>
                                </View>
                            </View>
                            <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
                                <ProgressBar
                                    key="raised"
                                    style={{
                                        backgroundColor: '#d6d6d6',
                                        position: 'absolute'
                                    }}
                                    progress={calculateCommunityProgress('raised', community)}
                                    color="#5289ff"
                                />
                                <ProgressBar
                                    key="claimed"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0)'
                                    }}
                                    progress={calculateCommunityProgress('claimed', community)}
                                    color="#50ad53"
                                />
                            </View>
                        </View>
                    </Card.Content>
                </Card>)}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'transparent',
    },
    scrollView: {
    },
    card: {
        margin: 30,
        padding: 0
    },
    cellHeader: {
        fontFamily: "Gelion-Bold",
        fontSize: 24,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: "#172b4d"
    },
    cellDescription: {
        fontFamily: "Gelion-Regular",
        fontSize: 15,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0.25,
        color: "#7e8da6"
    }
});

export default connector(CommunitiesScreen);