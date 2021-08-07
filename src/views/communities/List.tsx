import { NavigationProp, useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import i18n from 'assets/i18n';
import IconCommunity from 'components/svg/IconCommunity';
import SuspiciousActivityMiddleSvg from 'components/svg/SuspiciousActivityMiddleSvg';
import BackSvg from 'components/svg/header/BackSvg';
import * as Location from 'expo-location';
import { Screens } from 'helpers/constants';
import { amountToCurrency } from 'helpers/currency';
import { chooseMediaThumbnail } from 'helpers/index';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
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
    return (
        <Text
            style={{
                marginHorizontal: 4,
                fontFamily: 'Inter-Regular',
                fontSize: 12,
                lineHeight: 20,
                color: '#73839D',
            }}
        >
            ·
        </Text>
    );
}

function ListItem(props: {
    community: CommunityAttributes;
    exchangeRates: {
        [key: string]: number;
    };
    navigation: NavigationProp<any, any, any, any, any>;
}) {
    const { community, exchangeRates } = props;
    const claimAmount = amountToCurrency(
        community.contract.claimAmount,
        community.currency,
        exchangeRates
    );
    const claimFrequency =
        community.contract.baseInterval === 86400
            ? i18n.t('day')
            : i18n.t('week');
    return (
        <Pressable
            style={{
                height: 82,
                marginBottom: 16,
                marginHorizontal: 22,
                flex: 1,
                flexDirection: 'row',
            }}
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
                    style={{
                        width: 82,
                        height: 82,
                        borderRadius: 12,
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        marginLeft: 8,
                        marginBottom: 8,
                        bottom: 0,
                        backgroundColor: 'white',
                        borderRadius: 4,
                        padding: 2,
                    }}
                >
                    <Text>{countries[community.country].emoji}</Text>
                </View>
            </View>
            <View
                style={{
                    marginLeft: 16,
                    justifyContent: 'space-between',
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        lineHeight: 22,
                        fontSize: 16,
                        fontWeight: '800',
                        fontFamily: 'Manrope-ExtraBold',
                        color: '#1E3252',
                    }}
                >
                    {props.community.name}
                </Text>
                <View>
                    <View
                        style={{
                            // flex: 1,
                            flexDirection: 'row',
                            marginBottom: 7,
                            alignItems: 'center',
                        }}
                    >
                        <SuspiciousActivityMiddleSvg />
                        <Dot />
                        <Text
                            style={{
                                fontFamily: 'Inter-Bold',
                                fontSize: 13,
                                lineHeight: 20,
                                color: '#73839D',
                            }}
                        >
                            UBI
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: 13,
                                lineHeight: 20,
                                color: '#73839D',
                            }}
                        >
                            {' '}
                            {claimAmount}/{claimFrequency}
                        </Text>
                        <Dot />
                        <IconCommunity />
                        <Text
                            style={{
                                marginLeft: 4,
                                fontFamily: 'Inter-Regular',
                                fontSize: 13,
                                lineHeight: 20,
                                color: '#73839D',
                            }}
                        >
                            {props.community.state!.beneficiaries}
                        </Text>
                    </View>
                    <ProgressBar
                        progress={0.2}
                        color="#8A9FC2"
                        style={{
                            borderRadius: 6.5,
                            height: 4,
                            backgroundColor: '#E9ECEF',
                        }}
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

    const [communtiesOffset, setCommuntiesOffset] = useState(0);
    const [communtiesOrder, setCommuntiesOrder] = useState('bigger');
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
            } = { offset: 0, limit: 10 };
            if (communtiesOrder === 'nearest' && userLocation) {
                queryList = {
                    ...queryList,
                    orderBy: 'nearest',
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
                    exchangeRates={exchangeRates}
                    navigation={navigation}
                />
            )}
            ref={flatListRef}
            keyExtractor={(item) => item.publicId}
            onEndReachedThreshold={0.5}
            onEndReached={handleOnEndReached}
            showsVerticalScrollIndicator={false}
            // Performance settings
            // removeClippedSubviews // Unmount components when outside of window
            // initialNumToRender={4} // Reduce initial render amount
            // maxToRenderPerBatch={2} // Reduce number in each render batch
            // updateCellsBatchingPeriod={100} // Increase time between renders
            // windowSize={7} // Reduce the window size
            style={{ paddingTop: 20 }}
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
