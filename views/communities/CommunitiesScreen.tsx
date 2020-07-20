import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    ScrollView,
    RefreshControl,
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
import i18n from '../../assets/i18n';


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
    const [refreshing, setRefreshing] = useState(false);
    const [communities, setCommunities] = useState<ICommunityInfo[]>([]);

    useEffect(() => {
        getAllValidCommunities().then(setCommunities);
    }, []);

    const onRefresh = () => {
        getAllValidCommunities().then(setCommunities);
        setRefreshing(false);
    }

    const communityCard = (community: ICommunityInfo) => <Card
        key={community.name}
        elevation={8}
        style={styles.card}
        onPress={() => navigation.navigate('CommunityDetailsScreen', { community: community, user: props.user })}
    >
        <Card.Content style={{ margin: -16 }}>
            <ImageBackground
                source={{ uri: community.coverImage }}
                resizeMode="cover"
                style={styles.cardImage}
            >
                <Text style={styles.cardCommunityName}>
                    {community.name}
                </Text>
                <Text style={styles.cardLocation}>
                    <AntDesign name="enviromento" size={20} /> {community.city}, {community.country}
                </Text>
            </ImageBackground>
            <View style={{ margin: 10 }}>
                <View style={styles.cardInfo}>
                    <View>
                        <Text style={styles.cellHeader}>
                            {community.beneficiaries.added.length}
                        </Text>
                        <Text style={styles.cellDescription}>
                            {i18n.t('beneficiaries')}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.cellHeader}>
                            ${humanifyNumber(community.vars._claimAmount)}
                        </Text>
                        <Text style={styles.cellDescription}>
                            {claimFrequencyToText(community.vars._baseInterval)}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.cellHeader}>
                            {community.backers.length}
                        </Text>
                        <Text style={styles.cellDescription}>
                            {i18n.t('backers')}
                        </Text>
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
    </Card>

    return (
        <>
            <Header
                title={i18n.t('communities')}
                navigation={navigation}
            >
                <Button
                    mode="text"
                    onPress={() => navigation.navigate('CreateCommunityScreen')}
                >
                    {i18n.t('create')}
                </Button>
            </Header>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {communities.map(communityCard)}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
    },
    cardImage: {
        borderRadius: 40,
        width: '100%',
        height: 180,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    cardCommunityName: {
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center'
    },
    cardLocation: {
        fontSize: 20,
        color: 'white'
    },
    cardInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
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