import { NavigationProp, useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import { BigNumber } from 'bignumber.js';
import IconCommunity from 'components/svg/IconCommunity';
import BackSvg from 'components/svg/header/BackSvg';
import NoSuspiciousSvg from 'components/svg/suspicious/NoSuspiciousSvg';
import SuspiciousActivityMiddleSvg from 'components/svg/suspicious/SuspiciousActivityMiddleSvg';
import * as Location from 'expo-location';
import { communityOrderOptions, Screens } from 'helpers/constants';
import { amountToCurrency } from 'helpers/currency';
import { chooseMediaThumbnail } from 'helpers/index';
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

function Dot() {
    return <Text style={styles.dot}>·</Text>;
}

function ListItem(props: {
    community: CommunityAttributes;
    userCurrency: string;
    exchangeRates: {
        [key: string]: number;
    };
    navigation: NavigationProp<any, any, any, any, any>;
}) {
    const { community, exchangeRates } = props;
    const claimAmount = amountToCurrency(
        community.contract.claimAmount,
        props.userCurrency,
        exchangeRates
    );
    const claimFrequency =
        community.contract.baseInterval === 86400
            ? i18n.t('day')
            : i18n.t('week');

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
                props.navigation.navigate(Screens.CommunityDetails, {
                    communityId: community.id,
                })
            }
        >
            <View>
                <Image
                    source={{
                        uri: chooseMediaThumbnail(props.community.cover!, {
                            heigth: 88,
                            width: 88,
                        }),
                    }}
                    style={styles.cover}
                />
                <View style={styles.countryFlag}>
                    <Text>{countries[community.country].emoji}</Text>
                </View>
            </View>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>{props.community.name}</Text>
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
                            {i18n.t('ubi')}
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
                            {props.community.state!.beneficiaries}
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
    const flatListRef = useRef<FlatList<CommunityAttributes> | null>(null);

    const navigation = useNavigation();
    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );
    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );

    const [communtiesOffset, setCommuntiesOffset] = useState(0);
    // TODO: use later with filters
    const [communtiesOrder, setCommuntiesOrder] = useState(
        communityOrderOptions.bigger
    );
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
                limit: 10,
            })
            .then((c) => {
                if (c.length < 10) {
                    setReachedEndList(true);
                } else {
                    setReachedEndList(false);
                }
                setCommunities(c);
            })
            .finally(() => setRefreshing(false));
    }, []);

    const handleOnEndReached = (info: { distanceFromEnd: number }) => {
        if (!refreshing && !reachedEndList) {
            setRefreshing(true);
            let queryList: {
                offset: number;
                limit: number;
                orderBy?: string;
                filter?: string;
                lat?: number;
                lng?: number;
            } = { offset: communtiesOffset + 10, limit: 10 };
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
                    if (c.length < 10) {
                        setReachedEndList(true);
                    }
                    // as the users keeps scrolling, communities might get a different order
                    // and eventually be repeated
                    setCommunities([
                        ...new Map(
                            [...communities, ...c].map((item) => [
                                item.id,
                                item,
                            ])
                        ).values(),
                    ]);
                    setCommuntiesOffset(communtiesOffset + 10);
                })
                .finally(() => setRefreshing(false));
        }
    };

    return (
        <FlatList
            data={communities}
            renderItem={({ item }: { item: CommunityAttributes }) => (
                <ListItem
                    community={item}
                    userCurrency={userCurrency}
                    exchangeRates={exchangeRates}
                    navigation={navigation}
                />
            )}
            ref={flatListRef}
            keyExtractor={(item) => item.publicId}
            onEndReached={handleOnEndReached}
            showsVerticalScrollIndicator={false}
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
    dot: {
        marginHorizontal: 4,
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        lineHeight: 20,
        color: '#73839D',
    },
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
