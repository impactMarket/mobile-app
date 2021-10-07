import { NavigationProp, useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import { BigNumber } from 'bignumber.js';
import Dot from 'components/Dot';
import ShimmerPlaceholder from 'components/ShimmerPlaceholder';
import IconCommunity from 'components/svg/IconCommunity';
import BackSvg from 'components/svg/header/BackSvg';
import NoSuspiciousSvg from 'components/svg/suspicious/NoSuspiciousSvg';
import SuspiciousActivityMiddleSvg from 'components/svg/suspicious/SuspiciousActivityMiddleSvg';
import * as Location from 'expo-location';
import { communityOrderOptions, Screens } from 'helpers/constants';
import { amountToCurrency } from 'helpers/currency';
import { chooseMediaThumbnail } from 'helpers/index';
import { CommunityListRequestParams } from 'helpers/types/endpoints';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Api from 'services/api';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;

function ListItem(props: {
    community: CommunityAttributes;
    userCurrency: string;
    exchangeRates: {
        [key: string]: number;
    };
    navigation: NavigationProp<any, any, any, any, any>;
    width: number;
}) {
    const { community, exchangeRates, userCurrency, navigation, width } = props;
    const [loadedImage, setLoadedImage] = useState(false);

    if (community.name === undefined) {
        return (
            <View style={styles.container}>
                <ShimmerPlaceholder
                    delay={0}
                    duration={1000}
                    isInteraction
                    height={82}
                    width={82}
                    shimmerContainerProps={{
                        width: '100%',
                        borderRadius: 12,
                        // marginVertical: 22,
                    }}
                    shimmerStyle={{ borderRadius: 12 }}
                    visible={false}
                />
                <View style={{ marginLeft: 16 }}>
                    <ShimmerPlaceholder
                        delay={0}
                        duration={1000}
                        isInteraction
                        width={width / 2}
                        height={16}
                        shimmerStyle={{ borderRadius: 12 }}
                        containerProps={{ marginVertical: 4 }}
                    />
                    {Array(2)
                        .fill(0)
                        .map((_, i) => (
                            <ShimmerPlaceholder
                                key={i}
                                delay={0}
                                duration={1000}
                                isInteraction
                                width={width}
                                height={16}
                                shimmerStyle={{ borderRadius: 12 }}
                                containerProps={{ marginVertical: 4 }}
                            />
                        ))}
                </View>
            </View>
        );
    }

    const claimAmount = amountToCurrency(
        community.contract.claimAmount,
        userCurrency,
        exchangeRates
    );
    const claimFrequency =
        community.contract.baseInterval === 86400
            ? i18n.t('generic.day')
            : i18n.t('generic.week');

    let progress = 0;
    if (community.state.beneficiaries !== 0 && community.state.raised !== '0') {
        progress = parseFloat(
            new BigNumber(community.state.raised)
                .dividedBy(
                    new BigNumber(community.contract.maxClaim).multipliedBy(
                        community.state.beneficiaries
                    )
                )
                .toString()
        );
    }
    return (
        <Pressable
            style={styles.container}
            onPress={() =>
                navigation.navigate(Screens.CommunityDetails, {
                    communityId: community.id,
                })
            }
        >
            <View>
                <ShimmerPlaceholder
                    delay={0}
                    duration={1000}
                    isInteraction
                    height={82}
                    width={82}
                    shimmerContainerProps={{
                        width: '100%',
                        borderRadius: 12,
                        // marginVertical: 22,
                    }}
                    shimmerStyle={{ borderRadius: 12 }}
                    visible={loadedImage}
                >
                    <Image
                        source={{
                            uri: chooseMediaThumbnail(community.cover!, {
                                heigth: 88,
                                width: 88,
                            }),
                        }}
                        style={styles.cover}
                        onLoadEnd={() => setLoadedImage(true)}
                    />
                    <View style={styles.countryFlag}>
                        <Text>{countries[community.country].emoji}</Text>
                    </View>
                </ShimmerPlaceholder>
            </View>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>{community.name}</Text>
                <View>
                    <View style={styles.infoView}>
                        {community.suspect !== undefined &&
                        community.suspect !== null ? (
                            <SuspiciousActivityMiddleSvg />
                        ) : (
                            <NoSuspiciousSvg />
                        )}
                        <Dot />
                        <Text
                            style={[
                                styles.infoText,
                                { fontFamily: 'Inter-Bold' },
                            ]}
                        >
                            {i18n.t('generic.ubi')}
                        </Text>
                        <Text
                            style={[
                                styles.infoText,
                                { fontFamily: 'Inter-Regular' },
                            ]}
                        >
                            {' '}
                            {claimAmount}/{claimFrequency}
                        </Text>
                        <Dot />
                        <IconCommunity />
                        <Text
                            style={[
                                styles.infoText,
                                { fontFamily: 'Inter-Regular', marginLeft: 4 },
                            ]}
                        >
                            {community.state!.beneficiaries}
                        </Text>
                    </View>
                    <ProgressBar
                        progress={progress}
                        color="#8A9FC2"
                        style={styles.progressBar}
                    />
                </View>
            </View>
        </Pressable>
    );
}

function ListCommunitiesScreen() {
    const loadSlice = 20;
    const flatListRef = useRef<FlatList<CommunityAttributes> | null>(null);
    const { width } = Dimensions.get('screen');

    const navigation = useNavigation();
    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );
    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );

    const [communtiesOffset, setCommuntiesOffset] = useState(0);
    // TODO: use later with filters
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [communtiesOrder, setCommuntiesOrder] = useState(
        communityOrderOptions.bigger
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [userLocation, setUserLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);

    const [refreshing, setRefreshing] = useState(true);
    const [communities, setCommunities] = useState<CommunityAttributes[]>([]);
    const [reachedEndList, setReachedEndList] = useState(false);

    useEffect(() => {
        Api.community
            .list({
                offset: 0,
                limit: loadSlice,
            })
            .then((c) => {
                if (c.data.length < loadSlice) {
                    setReachedEndList(true);
                } else {
                    setReachedEndList(false);
                }
                setCommunities(c.data);
            })
            .finally(() => setRefreshing(false));
    }, []);

    const handleOnEndReached = (info: { distanceFromEnd: number }) => {
        if (!refreshing && !reachedEndList) {
            setRefreshing(true);
            let queryList: CommunityListRequestParams = {
                offset: communtiesOffset + loadSlice,
                limit: loadSlice,
            };
            if (
                communtiesOrder === communityOrderOptions.nearest &&
                userLocation
            ) {
                queryList = {
                    ...queryList,
                    orderBy: communityOrderOptions.nearest,
                    lat: userLocation.coords.latitude,
                    lng: userLocation.coords.longitude,
                };
            }
            Api.community
                .list(queryList)
                .then((c) => {
                    if (c.data.length < loadSlice) {
                        setReachedEndList(true);
                    }
                    // as the users keeps scrolling, communities might get a different order
                    // and eventually be repeated
                    setCommunities([
                        ...new Map(
                            [...communities, ...c.data].map((item) => [
                                item.id,
                                item,
                            ])
                        ).values(),
                    ]);
                    setCommuntiesOffset(communtiesOffset + loadSlice);
                })
                .finally(() => setRefreshing(false));
        }
    };

    const emptyList: any[] = Array(loadSlice)
        .fill(1)
        .map((_, idx) => ({
            id: idx,
        }));

    return (
        <FlatList
            data={
                communities.length === 0
                    ? emptyList
                    : refreshing
                    ? communities.concat(emptyList)
                    : communities
            }
            renderItem={({ item }) => (
                <ListItem
                    community={item}
                    userCurrency={userCurrency}
                    exchangeRates={exchangeRates}
                    navigation={navigation}
                    width={width - 84 - 16 - 44} // width - image width - space beteen - margins
                />
            )}
            ref={flatListRef}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleOnEndReached}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
        />
    );
}

ListCommunitiesScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: '',
    };
};

export default ListCommunitiesScreen;

const styles = StyleSheet.create({
    container: {
        height: 82,
        marginBottom: 16,
        marginHorizontal: 22,
        flex: 1,
        flexDirection: 'row',
    },
    cover: {
        width: 82,
        height: 82,
        borderRadius: 12,
    },
    countryFlag: {
        position: 'absolute',
        marginLeft: 8,
        marginBottom: 8,
        bottom: 0,
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 2,
    },
    titleView: {
        marginLeft: 16,
        justifyContent: 'space-between',
        flex: 1,
    },
    titleText: {
        lineHeight: 22,
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'Manrope-ExtraBold',
        color: '#1E3252',
    },
    infoView: {
        flexDirection: 'row',
        marginBottom: 7,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 13,
        lineHeight: 20,
        color: '#73839D',
    },
    progressBar: {
        borderRadius: 6.5,
        height: 4,
        backgroundColor: '#E9ECEF',
    },
});
