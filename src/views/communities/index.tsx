import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import {
    calculateCommunityProgress,
    claimFrequencyToText,
} from 'helpers/index';
import { humanifyCurrencyAmount } from 'helpers/currency';
import { iptcColors } from 'styles/index';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    RefreshControl,
    Image,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import Api from 'services/api';
import Card from 'components/core/Card';
import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import { Screens } from 'helpers/constants';
import { ICommunityLightDetails } from 'helpers/types/endpoints';
import { IRootState } from 'helpers/types/state';
import { ITabBarIconProps } from 'helpers/types/common';

interface ICommunitiesScreenProps {
    navigation: any;
    route: any;
}
const mapStateToProps = (state: IRootState) => {
    const { user } = state;
    return { user };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & ICommunitiesScreenProps;

function CommunitiesScreen(props: Props) {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [communities, setCommunities] = useState<ICommunityLightDetails[]>([]);

    useEffect(() => {
        Api.community.list().then(setCommunities);
    }, []);

    const onRefresh = () => {
        Api.community.list().then(setCommunities);
        setRefreshing(false);
    };

    const communityCard = (community: ICommunityLightDetails) => (
        <Card
            key={community.name}
            // elevation={8}
            style={styles.card}
            onPress={() =>
                navigation.navigate(Screens.CommunityDetails, {
                    community,
                })
            }
        >
            <Card.Content style={{ margin: -16 }}>
                <View style={{ position: 'relative' }}>
                    <Image
                        style={styles.cardImage}
                        source={{ uri: community.coverImage }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 5,
                            ...styles.cardImage,
                        }}
                    >
                        <Text style={styles.cardCommunityName}>
                            {community.name}
                        </Text>
                        <Text style={styles.cardLocation}>
                            <Entypo name="location-pin" size={15} />{' '}
                            {community.city}, {community.country}
                        </Text>
                    </View>
                    <View style={styles.darkerBackground} />
                </View>
                <View style={{ marginHorizontal: 17, marginBottom: 16.24 }}>
                    <View
                        style={{
                            flex: 3,
                            flexDirection: 'row',
                            marginTop: 19.27,
                            marginBottom: 17.85,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cellHeader}>
                                {community.state.beneficiaries}
                            </Text>
                            <Text style={styles.cellDescription}>
                                {i18n.t('beneficiaries')}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cellHeader}>
                                $
                                {humanifyCurrencyAmount(
                                    community.contract.claimAmount
                                )}
                            </Text>
                            <Text style={styles.cellDescription}>
                                {claimFrequencyToText(
                                    community.contract.baseInterval
                                )}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cellHeader}>
                                {community.state.backers}
                            </Text>
                            <Text style={styles.cellDescription}>
                                {i18n.t('backers')}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <ProgressBar
                            key="raised"
                            style={{
                                backgroundColor: iptcColors.softGray,
                                position: 'absolute',
                                borderRadius: 6.5,
                                height: 8.12,
                            }}
                            progress={calculateCommunityProgress(
                                'raised',
                                community
                            )}
                            color="#5289ff"
                        />
                        <ProgressBar
                            key="claimed"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0)',
                                borderRadius: 6.5,
                                height: 8.12,
                            }}
                            progress={calculateCommunityProgress(
                                'claimed',
                                community
                            )}
                            color="#50ad53"
                        />
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <>
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

CommunitiesScreen.navigationOptions = () => {
    return {
        headerTitle: i18n.t('communities'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <CommunitiesSvg focused={props.focused} />
        ),
    };
};

const styles = StyleSheet.create({
    scrollView: {
        paddingTop: 12, // TODO: I'm not really sure about this
    },
    cardImage: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        width: '100%',
        height: 147,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    darkerBackground: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.15)',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 147,
    },
    cardCommunityName: {
        zIndex: 5,
        marginHorizontal: 15,
        fontSize: 28,
        lineHeight: 34,
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center',
    },
    cardLocation: {
        zIndex: 5,
        fontFamily: 'Gelion-Regular',
        fontSize: 16,
        lineHeight: 19,
        color: 'white',
    },
    cardInfo: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 22,
        // marginTop: 8,
        padding: 0,
    },
    cellHeader: {
        fontFamily: 'Gelion-Bold',
        fontSize: 24,
        lineHeight: 24,
        textAlign: 'center',
        color: iptcColors.nileBlue,
    },
    cellDescription: {
        fontFamily: 'Gelion-Regular',
        fontSize: 14,
        lineHeight: 16,
        opacity: 0.7,
        textAlign: 'center',
        color: iptcColors.nileBlue,
        marginTop: 6,
    },
});

export default connector(CommunitiesScreen);
